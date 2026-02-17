import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Scale, FileText, Users, Heart, Shield, AlertCircle, Book, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, Phone, Mail, Clock, Award } from 'lucide-react';

const FamilyLaw = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set page title and meta description
    document.title = 'Family & Divorce Law in Kenya Complete Guide - Wakili';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Complete guide to family and divorce law in Kenya. Learn about divorce process, child custody, maintenance, adoption, marriage types, prenuptial agreements, and domestic violence laws. Updated 2026.'
      );
    }

    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does a divorce take in Kenya?",
      answer: "An uncontested divorce typically takes 6-12 months, while contested divorces can take 12-24 months or longer depending on complexity, court schedules, and whether appeals are filed. After the decree nisi is issued, parties must wait six months before applying for the decree absolute (final divorce order), though this can be shortened in special circumstances."
    },
    {
      question: "How much does divorce cost in Kenya?",
      answer: "Legal costs for divorce range from KES 50,000 to KES 300,000 depending on whether it's contested, the complexity of asset division, custody disputes, and lawyer fees. Court filing fees are relatively modest (around KES 1,000-5,000), but lawyer fees constitute the bulk of costs. Uncontested divorces with mutual agreement are significantly cheaper."
    },
    {
      question: "Can a father get custody of children in Kenya?",
      answer: "Yes. Kenyan law does not favor mothers over fathers in custody decisions. The court's primary consideration is the best interests of the child, which includes assessing each parent's ability to provide care, maintain stability, and facilitate the child's relationship with the other parent. Fathers have equal rights to seek custody, and many fathers successfully obtain sole or joint custody."
    },
    {
      question: "What happens to property during divorce in Kenya?",
      answer: "Under the Matrimonial Property Act 2013, property acquired during marriage is presumed to be jointly owned regardless of who paid for it. The court considers both monetary and non-monetary contributions (including homemaking and childcare) when dividing property. Property owned before marriage generally remains with the original owner unless commingled. The court aims for equitable (fair), not necessarily equal, division."
    },
    {
      question: "Is adultery still grounds for divorce in Kenya?",
      answer: "Yes. Adultery remains one of the facts that can be used to prove irretrievable breakdown of marriage under the Marriage Act 2014. However, the petitioner must file for divorce within six months of discovering the adultery (unless continued cohabitation after discovery makes it difficult to prove intolerance). Evidence such as witness statements, electronic communications, or private investigator reports may be required."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-0">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200 hover:scale-105"><Home className="w-4 h-4 mr-1" /> Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/laws-of-kenya" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">Laws of Kenya</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">Family & Divorce Law</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <Scale className="w-12 h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Family & Divorce Law in Kenya
            </h1>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed">
            Your complete guide to understanding family law, divorce proceedings, child custody, maintenance, adoption, and domestic violence protections in Kenya. <span className="font-semibold text-yellow-300">Updated for 2026.</span>
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need family law guidance and legal services. Please help me understand my options.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              aria-label="Request guidance on WhatsApp"
            >
              <Phone className="w-5 h-5" />
              Get Guidance on WhatsApp
            </a>
            <a
              href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Family Law Guidance Request')}&body=${encodeURIComponent('Hello, I need guidance on family/divorce law in Kenya. My questions/services needed are:')}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl shadow-lg border border-white/30 transition-all duration-300 hover:scale-105"
              aria-label="Request guidance by email"
            >
              <Mail className="w-5 h-5" />
              Email for Legal Services
            </a>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <Clock className="w-8 h-8 mb-3 text-yellow-300" />
              <div className="text-3xl font-bold mb-1">6-24 Months</div>
              <div className="text-sm opacity-90">Average Divorce Timeline</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <Award className="w-8 h-8 mb-3 text-green-300" />
              <div className="text-3xl font-bold mb-1">5 Types</div>
              <div className="text-sm opacity-90">Recognized Marriages</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <Shield className="w-8 h-8 mb-3 text-red-300" />
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm opacity-90">Legal Protection Available</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="content-full-width">
        <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        
        {/* Section 1: Constitutional Provisions on Family */}
        <section className="mb-16 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="flex items-start mb-6 relative z-10">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-xl mr-4 mt-1 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">Constitutional Provisions on Family - Article 45</h2>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-blue-600 mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 mr-2" />
                  Constitution of Kenya 2010 - Article 45
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p className="leading-relaxed"><strong>(1)</strong> The family is the natural and fundamental unit of society and the necessary basis of social order, and shall enjoy the recognition and protection of the State.</p>
                  <p className="leading-relaxed"><strong>(2)</strong> Every adult has the right to marry a person of the opposite sex, based on the free consent of the parties.</p>
                  <p className="leading-relaxed"><strong>(3)</strong> Parties to a marriage are entitled to equal rights at the time of the marriage, during the marriage and at the dissolution of the marriage.</p>
                  <p className="leading-relaxed"><strong>(4)</strong> Parliament shall enact legislation that recognizes—
                    <span className="block ml-6 mt-2">(a) marriages concluded under any tradition, or system of religious, personal or family law; and</span>
                    <span className="block ml-6">(b) any system of personal and family law under any tradition, or adhered to by persons professing a particular religion, to the extent that any such marriages or systems of law are consistent with this Constitution.</span>
                  </p>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The Constitution of Kenya 2010 fundamentally transformed family law by enshrining equality between spouses and providing constitutional protection for all types of marriages. This constitutional framework has been operationalized through comprehensive legislation enacted by Parliament.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Legislative Framework */}
        <section className="mb-16 bg-white rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border border-indigo-100 group">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-700 p-4 rounded-xl mr-4 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Book className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Legislative Framework for Family Law in Kenya</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {[
                  {
                    title: "Marriage Act, 2014",
                    color: "from-blue-500 to-blue-700",
                    points: [
                      "Consolidates and harmonizes all marriage laws",
                      "Recognizes 5 types of marriages",
                      "Sets minimum marriage age at 18 years",
                      "Provides for civil, religious, customary, Hindu, and Islamic marriages",
                      "Establishes registration requirements",
                      "Governs dissolution of marriage proceedings"
                    ]
                  },
                  {
                    title: "Matrimonial Property Act, 2013",
                    color: "from-green-500 to-emerald-700",
                    points: [
                      "Governs ownership and division of matrimonial property",
                      "Recognizes both monetary and non-monetary contributions",
                      "Presumes equal contribution to matrimonial property",
                      "Allows prenuptial and postnuptial agreements",
                      "Protects family homes from unilateral disposal",
                      "Provides for property division on divorce or death"
                    ]
                  },
                  {
                    title: "Children Act, 2022",
                    color: "from-pink-500 to-rose-700",
                    points: [
                      "Prioritizes best interests of the child",
                      "Establishes parental responsibility framework",
                      "Governs custody, access, and guardianship",
                      "Mandates child maintenance obligations",
                      "Regulates adoption and foster care",
                      "Protects children from abuse and neglect"
                    ]
                  },
                  {
                    title: "Protection Against Domestic Violence Act, 2015",
                    color: "from-red-500 to-pink-700",
                    points: [
                      "Defines domestic violence broadly",
                      "Provides for protection orders",
                      "Establishes occupation orders for victims",
                      "Criminalizes violation of protection orders",
                      "Mandates police intervention",
                      "Offers immediate emergency protection"
                    ]
                  }
                ].map((act, idx) => (
                  <div key={idx} className={`bg-gradient-to-br ${act.color} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Scale className="w-6 h-6 mr-2" />
                      {act.title}
                    </h3>
                    <ul className="space-y-2">
                      {act.points.map((point, pidx) => (
                        <li key={pidx} className="flex items-start text-sm">
                          <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border-l-4 border-amber-500 shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  <AlertCircle className="w-6 h-6 text-amber-600 mr-2" />
                  Additional Relevant Legislation
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Succession Act (Cap 160)</strong> - Governs inheritance and succession rights for spouses and children
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Law of Succession Act</strong> - Provides for distribution of deceased estates among family members
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Births and Deaths Registration Act</strong> - Regulates registration of marriages, births, and deaths
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <strong>Sexual Offences Act, 2006</strong> - Addresses sexual violence within marriage and family
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Comprehensive Grounds for Divorce */}
        <section className="mb-16 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-red-200 group">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-red-600 to-rose-700 p-4 rounded-xl mr-4 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">Comprehensive Grounds for Divorce in Kenya</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-red-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Single Ground: Irretrievable Breakdown of Marriage</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Under Section 66 of the Marriage Act, 2014, the sole ground for divorce is <strong>irretrievable breakdown of marriage</strong>. However, this must be proven by demonstrating one or more of the following facts:
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    number: "1",
                    title: "Adultery",
                    color: "from-red-500 to-red-700",
                    description: "The respondent has committed adultery and the petitioner finds it intolerable to live with the respondent.",
                    details: [
                      "Must be filed within 6 months of discovering the adultery",
                      "Continued cohabitation after discovery may bar the petition",
                      "Requires proof (witness statements, photos, electronic communications)",
                      "The adulterer can be cited as a co-respondent",
                      "DNA evidence may be used if paternity is disputed"
                    ],
                    legalNote: "Section 66(1)(a) of the Marriage Act, 2014"
                  },
                  {
                    number: "2",
                    title: "Unreasonable Behavior",
                    color: "from-orange-500 to-orange-700",
                    description: "The respondent has behaved in such a way that the petitioner cannot reasonably be expected to live with them.",
                    details: [
                      "Includes physical abuse, verbal abuse, emotional cruelty",
                      "Financial irresponsibility or gambling",
                      "Alcoholism or drug addiction affecting family life",
                      "Refusal of sexual relations (with exceptions)",
                      "False accusations of infidelity or other serious matters",
                      "Excessive controlling or domineering behavior"
                    ],
                    legalNote: "Section 66(1)(b) of the Marriage Act, 2014"
                  },
                  {
                    number: "3",
                    title: "Desertion",
                    color: "from-amber-500 to-yellow-700",
                    description: "The respondent has deserted the petitioner for a continuous period of at least three years immediately preceding the petition.",
                    details: [
                      "Must be continuous desertion for 3+ years",
                      "Desertion must be without consent",
                      "Desertion must be without reasonable cause",
                      "Includes constructive desertion (forcing spouse to leave)",
                      "Temporary absences for work don't constitute desertion",
                      "Attempts at reconciliation may interrupt the period"
                    ],
                    legalNote: "Section 66(1)(c) of the Marriage Act, 2014"
                  },
                  {
                    number: "4",
                    title: "Separation (With Consent)",
                    color: "from-blue-500 to-blue-700",
                    description: "The parties have lived apart for a continuous period of at least three years and both consent to the divorce.",
                    details: [
                      "Requires 3+ years of continuous separation",
                      "Both spouses must consent to the divorce",
                      "Can live under same roof but in separate arrangements",
                      "Consent must be informed and voluntary",
                      "Reconciliation attempts interrupt the period",
                      "Fastest route if both parties agree"
                    ],
                    legalNote: "Section 66(1)(d) of the Marriage Act, 2014"
                  },
                  {
                    number: "5",
                    title: "Separation (Without Consent)",
                    color: "from-indigo-500 to-purple-700",
                    description: "The parties have lived apart for a continuous period of at least five years.",
                    details: [
                      "Requires 5+ years of continuous separation",
                      "No consent needed from respondent",
                      "Petitioner can unilaterally seek divorce",
                      "Respondent can defend on grounds of hardship",
                      "Court considers financial implications for respondent",
                      "Longest waiting period but most certain"
                    ],
                    legalNote: "Section 66(1)(e) of the Marriage Act, 2014"
                  }
                ].map((ground) => (
                  <div key={ground.number} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-300">
                    <div className={`bg-gradient-to-r ${ground.color} text-white p-6`}>
                      <div className="flex items-start">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-2xl">
                          {ground.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-2">{ground.title}</h3>
                          <p className="opacity-95 leading-relaxed">{ground.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <Scale className="w-5 h-5 mr-2 text-red-600" />
                        Key Requirements & Considerations:
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {ground.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                        <p className="text-sm text-gray-700">
                          <strong>Legal Basis:</strong> {ground.legalNote}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  Important Legal Considerations
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p>You can cite multiple grounds in one petition to strengthen your case</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p>Courts may encourage reconciliation before granting divorce</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p>Burden of proof lies with the petitioner to establish grounds</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p>Legal representation is highly recommended for complex cases</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Detailed Divorce Process */}
        <section className="mb-16 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border border-blue-200 group">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-700 p-4 rounded-xl mr-4 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">Complete Divorce Process in Kenya (2026)</h2>
              
              <div className="space-y-6 mb-8">
                {[
                  {
                    step: 1,
                    title: "Legal Consultation & Assessment",
                    duration: "1-2 weeks",
                    color: "from-blue-500 to-blue-700",
                    activities: [
                      "Consult a qualified family law advocate",
                      "Review marriage certificate and supporting documents",
                      "Assess grounds for divorce under Marriage Act, 2014",
                      "Discuss custody, maintenance, and property implications",
                      "Explore alternative dispute resolution options",
                      "Receive cost estimates and timeline projection"
                    ]
                  },
                  {
                    step: 2,
                    title: "Filing the Divorce Petition",
                    duration: "1 week",
                    color: "from-indigo-500 to-indigo-700",
                    activities: [
                      "Prepare and sign divorce petition (Form 11)",
                      "File petition at Family Division of High Court",
                      "Pay court filing fees (approximately KES 1,500-5,000)",
                      "Petition must state grounds and relief sought",
                      "Include affidavit supporting facts alleged",
                      "Court assigns case number and judge"
                    ]
                  },
                  {
                    step: 3,
                    title: "Service of Process",
                    duration: "2-4 weeks",
                    color: "from-purple-500 to-purple-700",
                    activities: [
                      "Petition served to respondent personally",
                      "Can use process server or court bailiff",
                      "If location unknown, service by publication in newspapers",
                      "Respondent has 21 days to file response",
                      "Affidavit of service filed with court",
                      "Respondent may accept or contest petition"
                    ]
                  },
                  {
                    step: 4,
                    title: "Response & Defense (If Contested)",
                    duration: "2-6 weeks",
                    color: "from-pink-500 to-rose-700",
                    activities: [
                      "Respondent files memorandum of appearance",
                      "Respondent files answer to petition if defending",
                      "May file cross-petition citing own grounds",
                      "Parties exchange witness statements",
                      "Discovery of relevant documents",
                      "Preliminary objections heard if raised"
                    ]
                  },
                  {
                    step: 5,
                    title: "Reconciliation & Mediation",
                    duration: "1-3 months",
                    color: "from-green-500 to-emerald-700",
                    activities: [
                      "Court may order mandatory reconciliation sessions",
                      "Parties meet with court-appointed mediator",
                      "Attempt to resolve custody and property amicably",
                      "If successful, divorce petition may be withdrawn",
                      "If unsuccessful, case proceeds to trial",
                      "Mediated agreements reduce court time significantly"
                    ]
                  },
                  {
                    step: 6,
                    title: "Interim Orders",
                    duration: "Variable",
                    color: "from-orange-500 to-amber-700",
                    activities: [
                      "Apply for temporary custody of children",
                      "Request interim maintenance/spousal support",
                      "Seek occupation orders for family home",
                      "Apply for protection orders if needed",
                      "Request injunctions against property disposal",
                      "Orders remain until final judgment"
                    ]
                  },
                  {
                    step: 7,
                    title: "Pre-Trial Conference",
                    duration: "1-2 months",
                    color: "from-red-500 to-rose-700",
                    activities: [
                      "Parties meet before judge to narrow issues",
                      "Identify agreed facts and disputed matters",
                      "Set timelines for filing further documents",
                      "Determine number of witnesses needed",
                      "Estimate trial duration",
                      "Final settlement attempts encouraged"
                    ]
                  },
                  {
                    step: 8,
                    title: "Trial & Hearing",
                    duration: "2-6 months",
                    color: "from-violet-500 to-purple-700",
                    activities: [
                      "Petitioner presents case with evidence",
                      "Witnesses testify under oath",
                      "Respondent presents defense",
                      "Cross-examination of all witnesses",
                      "Submission of documentary evidence",
                      "Final submissions by both advocates"
                    ]
                  },
                  {
                    step: 9,
                    title: "Decree Nisi (Conditional Order)",
                    duration: "1-3 months after trial",
                    color: "from-cyan-500 to-blue-700",
                    activities: [
                      "Judge delivers judgment",
                      "If petition granted, decree nisi issued",
                      "Decree nisi is conditional divorce order",
                      "Addresses custody, maintenance, property",
                      "Either party can appeal within 30 days",
                      "Marriage not yet fully dissolved"
                    ]
                  },
                  {
                    step: 10,
                    title: "Decree Absolute (Final Order)",
                    duration: "6+ months after decree nisi",
                    color: "from-emerald-500 to-green-700",
                    activities: [
                      "Apply for decree absolute after 6 months",
                      "Court may shorten waiting period in special cases",
                      "No outstanding appeals pending",
                      "All court orders substantially complied with",
                      "Decree absolute finalizes divorce",
                      "Parties free to remarry after decree absolute"
                    ]
                  }
                ].map((stage) => (
                  <div key={stage.step} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-300">
                    <div className={`bg-gradient-to-r ${stage.color} text-white p-6`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mr-4 font-bold text-xl">
                            {stage.step}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold">{stage.title}</h3>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {stage.duration}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                      <ul className="space-y-2">
                        {stage.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start text-gray-700">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <CheckCircle2 className="w-6 h-6 mr-2" />
                    Uncontested Divorce Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span>Filing to Service:</span><strong>2-3 weeks</strong></p>
                    <p className="flex justify-between"><span>Reconciliation Period:</span><strong>1-2 months</strong></p>
                    <p className="flex justify-between"><span>Decree Nisi:</span><strong>3-6 months</strong></p>
                    <p className="flex justify-between"><span>Decree Absolute:</span><strong>6+ months later</strong></p>
                    <div className="border-t border-white/30 my-3"></div>
                    <p className="flex justify-between text-lg"><span>Total Duration:</span><strong>9-15 months</strong></p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-rose-700 text-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    Contested Divorce Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span>Filing to Trial:</span><strong>6-12 months</strong></p>
                    <p className="flex justify-between"><span>Trial Process:</span><strong>2-6 months</strong></p>
                    <p className="flex justify-between"><span>Judgment & Decree Nisi:</span><strong>1-3 months</strong></p>
                    <p className="flex justify-between"><span>Decree Absolute:</span><strong>6+ months later</strong></p>
                    <div className="border-t border-white/30 my-3"></div>
                    <p className="flex justify-between text-lg"><span>Total Duration:</span><strong>18-30+ months</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Matrimonial Property Division */}
        <section className="mb-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-green-200 group">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-4 rounded-xl mr-4 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">Matrimonial Property Division - Matrimonial Property Act, 2013</h2>
              
              <div className="bg-white/90 p-6 rounded-xl shadow-lg mb-6 border-l-4 border-green-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Fundamental Principles</h3>
                <div className="space-y-3 text-gray-700">
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Equal Contribution Presumption:</strong> Both spouses presumed to have contributed equally to matrimonial property regardless of financial input</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Non-Monetary Contributions:</strong> Homemaking, childcare, and domestic work recognized as valuable contributions</span>
                  </p>
                  <p className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Equitable Division:</strong> Court aims for fairness, not necessarily 50/50 split</span>
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    Matrimonial Property (Divisible)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Family home (matrimonial home)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Property acquired during marriage</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Household goods and furniture</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Vehicles purchased during marriage</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Joint bank accounts and savings</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Business assets built during marriage</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Shares and investments</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2"></div>
                      <span>Pension benefits and gratuities</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="bg-red-100 p-2 rounded-lg mr-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    Separate Property (Not Divisible)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2"></div>
                      <span>Property owned before marriage</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2"></div>
                      <span>Gifts received personally from third parties</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2"></div>
                      <span>Inheritance received personally</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2"></div>
                      <span>Personal injury compensation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2"></div>
                      <span>Property excluded by prenuptial agreement</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2"></div>
                      <span>Professional qualifications/degrees</span>
                    </li>
                  </ul>
                  <div className="mt-4 bg-amber-50 p-3 rounded-lg text-sm text-gray-700">
                    <strong>Note:</strong> These may become divisible if commingled with matrimonial property or improved using matrimonial funds
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Factors Court Considers When Dividing Property</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {[
                    "Duration of the marriage",
                    "Contributions made by each spouse (monetary and non-monetary)",
                    "Needs of each spouse after divorce",
                    "Age and health of each spouse",
                    "Income and earning capacity of each spouse",
                    "Standard of living during marriage",
                    "Custodial responsibilities for children",
                    "Property brought into marriage by each spouse",
                    "Obligations and responsibilities of each spouse",
                    "Conduct of parties (only if inequitable to ignore)"
                  ].map((factor, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Child Custody & Maintenance - Children Act 2022 */}
        <section className="mb-16 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-pink-200 group">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-pink-600 to-rose-700 p-4 rounded-xl mr-4 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">Child Custody & Maintenance - Children Act, 2022</h2>
              
              <div className="bg-white/90 p-6 rounded-xl shadow-lg mb-6 border-l-4 border-pink-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <Heart className="w-6 h-6 text-pink-600 mr-2" />
                  Paramount Principle: Best Interests of the Child
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Section 4 of the Children Act, 2022 mandates that in all actions concerning children, whether by courts, administrative authorities, or legislative bodies, the <strong>best interests of the child shall be the primary consideration</strong>. This principle overrides all other considerations including parental preferences.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Types of Custody Arrangements</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      type: "Sole Custody",
                      color: "from-blue-500 to-blue-700",
                      description: "One parent has primary physical and legal custody. The other parent may have visitation rights.",
                      suitableFor: "When one parent is unfit, abusive, or unable to care for the child"
                    },
                    {
                      type: "Joint Custody",
                      color: "from-green-500 to-emerald-700",
                      description: "Both parents share legal decision-making authority, though child may primarily reside with one parent.",
                      suitableFor: "When both parents are capable and willing to cooperate in raising the child"
                    },
                    {
                      type: "Shared Custody",
                      color: "from-purple-500 to-violet-700",
                      description: "Child spends substantial time living with both parents on a structured schedule.",
                      suitableFor: "When parents live nearby and can facilitate frequent transitions"
                    }
                  ].map((custody, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${custody.color} text-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                      <h4 className="text-xl font-bold mb-3">{custody.type}</h4>
                      <p className="text-sm mb-3 opacity-95">{custody.description}</p>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-xs">
                        <strong>Suitable For:</strong> {custody.suitableFor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Factors Courts Consider in Custody Decisions</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { category: "Child's Welfare", items: ["Child's age, sex, and maturity", "Child's wishes (if old enough to express)", "Child's physical, emotional, and educational needs", "Stability and continuity in child's life", "Child's relationship with siblings"] },
                    { category: "Parental Capacity", items: ["Ability to provide basic needs", "Mental and physical health", "Moral character and lifestyle", "Availability and time for child", "Willingness to facilitate other parent's access"] },
                    { category: "Practical Considerations", items: ["Proximity to school and community", "Housing situation and living conditions", "Financial resources", "Extended family support system", "Cultural and religious upbringing"] },
                    { category: "Safety & Protection", items: ["History of domestic violence", "Substance abuse issues", "Child abuse or neglect", "Criminal record", "Risk of abduction or harm"] }
                  ].map((section, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-lg border-l-4 border-pink-500">
                      <h4 className="font-bold text-gray-900 mb-3">{section.category}</h4>
                      <ul className="space-y-2">
                        {section.items.map((item, iidx) => (
                          <li key={iidx} className="flex items-start text-gray-700 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-pink-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-600 to-rose-700 text-white p-6 rounded-xl shadow-xl mb-6">
                <h3 className="text-2xl font-bold mb-4">Child Maintenance Obligations</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 flex items-center">
                      <Scale className="w-5 h-5 mr-2" />
                      What Maintenance Covers
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {["Food, clothing, and shelter", "Education and school fees", "Medical care and insurance", "Transportation", "Extracurricular activities", "Childcare costs", "Basic necessities and comforts"].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-2"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Determining Maintenance Amount
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {["Child's actual needs and lifestyle", "Parent's income and assets", "Parent's financial obligations", "Standard of living before separation", "Both parents contribute proportionally", "Inflation adjustments over time", "Special needs of the child"].map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-white rounded-full mt-2 mr-2"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                  <p className="text-sm"><strong>Important:</strong> Both parents have equal legal obligation to maintain children until age 18 (or longer if in education or disabled). Failure to pay maintenance can result in salary deduction, property attachment, or imprisonment.</p>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Access/Visitation Rights</h3>
                <p className="text-gray-700 mb-3">
                  The non-custodial parent typically has the right to regular access unless court finds it harmful to the child. Access arrangements should specify:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
                  {["Weekday and weekend schedules", "School holiday arrangements", "Public holiday and special occasion access", "Duration and timing of visits", "Pick-up and drop-off locations", "Communication methods (calls, video chats)", "Conditions for supervised access if needed", "Process for varying access arrangements"].map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Domestic Violence Protection */}
        <section className="mb-16 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl shadow-2xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-4 border-red-300 group">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-red-600 to-rose-700 p-4 rounded-xl mr-4 mt-1 shadow-lg group-hover:scale-110 animate-pulse transition-transform duration-300">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-6">Protection Against Domestic Violence Act, 2015</h2>
              
              <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-xl shadow-xl mb-6">
                <div className="flex items-start mb-4">
                  <AlertCircle className="w-8 h-8 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Emergency Helplines - Available 24/7</h3>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg text-center">
                        <Phone className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm opacity-90">Police Emergency</div>
                        <div className="text-3xl font-bold">999 / 112</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg text-center">
                        <Phone className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm opacity-90">GBV Helpline</div>
                        <div className="text-3xl font-bold">1195</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg text-center">
                        <Phone className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm opacity-90">FIDA Kenya</div>
                        <div className="text-3xl font-bold">0800 720 553</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">What Constitutes Domestic Violence</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { type: "Physical Abuse", color: "red", examples: ["Hitting, slapping, kicking", "Pushing or shoving", "Burning or scalding", "Choking or strangling", "Use of weapons", "Restraining or locking up"] },
                    { type: "Sexual Abuse", color: "pink", examples: ["Forced sexual acts", "Marital rape", "Sexual assault", "Forced pornography viewing", "Sexual humiliation", "Reproductive coercion"] },
                    { type: "Emotional/Psychological Abuse", color: "purple", examples: ["Constant criticism and insults", "Threats and intimidation", "Isolation from family/friends", "Controlling behavior", "Gaslighting", "Humiliation in public"] },
                    { type: "Economic Abuse", color: "amber", examples: ["Controlling finances", "Preventing employment", "Withholding money for necessities", "Running up debts in victim's name", "Destroying property", "Refusing to contribute to household"] }
                  ].map((category, idx) => (
                    <div key={idx} className={`bg-${category.color}-50 border-l-4 border-${category.color}-500 p-4 rounded-lg`}>
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <div className={`w-3 h-3 bg-${category.color}-500 rounded-full mr-2`}></div>
                        {category.type}
                      </h4>
                      <ul className="space-y-1.5 text-sm text-gray-700">
                        {category.examples.map((ex, eidx) => (
                          <li key={eidx} className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Types of Protection Orders</h3>
                {[
                  {
                    order: "Protection Order",
                    color: "from-red-500 to-red-700",
                    duration: "Up to 12 months (renewable)",
                    provisions: [
                      "Prohibits respondent from committing further violence",
                      "Restrains from entering victim's residence or workplace",
                      "Prohibits contact with victim and children",
                      "Orders to stay away from specified locations",
                      "Surrender of weapons if applicable",
                      "Mandatory counseling or treatment programs"
                    ]
                  },
                  {
                    order: "Occupation Order",
                    color: "from-orange-500 to-amber-700",
                    duration: "Variable based on circumstances",
                    provisions: [
                      "Grants victim exclusive occupation of home",
                      "Requires respondent to vacate matrimonial home",
                      "Effective even if respondent owns property",
                      "Can include furniture and household items",
                      "Police enforce eviction if necessary",
                      "Prevents re-entry without court permission"
                    ]
                  },
                  {
                    order: "Interim Protection Order",
                    color: "from-yellow-500 to-orange-700",
                    duration: "Until full hearing (usually 21 days)",
                    provisions: [
                      "Immediate emergency protection",
                      "Issued ex parte (without respondent present)",
                      "Can be obtained same day in urgent cases",
                      "Temporary custody and maintenance orders",
                      "Police protection if needed",
                      "Converted to full order after hearing"
                    ]
                  }
                ].map((protection, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-200">
                    <div className={`bg-gradient-to-r ${protection.color} text-white p-6`}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-2xl font-bold">{protection.order}</h4>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {protection.duration}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-white to-red-50">
                      <h5 className="font-bold text-gray-900 mb-3">Provisions Include:</h5>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {protection.provisions.map((provision, pidx) => (
                          <li key={pidx} className="flex items-start text-gray-700 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{provision}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-bold mb-4">Enforcement & Penalties</h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-semibold mb-3">Violation Consequences:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Criminal offense punishable by fine up to KES 100,000</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Imprisonment up to 3 years or both</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Arrest without warrant by police</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Contempt of court proceedings</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Victim Support Services:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Free legal aid through FIDA Kenya & National Legal Aid</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Safe shelters and rescue centers</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Counseling and psychosocial support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Medical examination and treatment</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-8 md:p-16 text-center overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md inline-block p-4 rounded-full mb-6">
              <Scale className="w-12 h-12" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Need Legal Help with Family Law Matters?
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Our experienced family law advocates can guide you through divorce, custody, maintenance, and other family law matters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link to="/register" className="group bg-white text-blue-700 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105">
                <Users className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Find a Lawyer Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contactus" className="group bg-transparent border-3 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105">
                <Mail className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Get Free Consultation
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-90">Lawyers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Interactive Accordion */}
        <section className="mt-16 mb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 md:p-10 border border-indigo-200">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl mr-4 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-transparent hover:border-blue-300 transition-all duration-300">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-blue-50 transition-colors duration-200"
                >
                  <div className="flex items-start flex-1">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{faq.question}</h3>
                  </div>
                  <div className={`ml-4 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    {openFaq === index ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="p-6 pt-0 bg-gradient-to-b from-blue-50 to-white">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section className="mt-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-10 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 flex items-center">
            <Book className="w-8 h-8 mr-3 text-blue-600" />
            Official Resources & Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { href: "http://www.kenyalaw.org", icon: Scale, title: "Kenya Law", desc: "Laws of Kenya & Legal Resources", color: "from-blue-500 to-blue-700" },
              { href: "http://www.judiciary.go.ke", icon: Scale, title: "Judiciary of Kenya", desc: "Court Services & Information", color: "from-indigo-500 to-indigo-700" },
              { href: "http://www.brs.go.ke", icon: FileText, title: "Civil Registration Services", desc: "Birth, Marriage & Death Certificates", color: "from-green-500 to-green-700" },
              { to: "/register", icon: Users, title: "Find a Family Lawyer", desc: "Connect with Experienced Advocates", color: "from-purple-500 to-purple-700", internal: true }
            ].map((resource, idx) => {
              const Icon = resource.icon;
              
              if (resource.internal) {
                return (
                  <Link key={idx} to={resource.to!} className="group flex items-center p-6 bg-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-200">
                    <div className={`bg-gradient-to-br ${resource.color} p-4 rounded-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-1 flex items-center">
                        {resource.title}
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="text-sm text-gray-600">{resource.desc}</div>
                    </div>
                  </Link>
                );
              } else {
                return (
                  <a key={idx} href={resource.href} target="_blank" rel="noopener noreferrer" className="group flex items-center p-6 bg-white rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-200">
                    <div className={`bg-gradient-to-br ${resource.color} p-4 rounded-xl mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-lg mb-1 flex items-center">
                        {resource.title}
                        <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="text-sm text-gray-600">{resource.desc}</div>
                    </div>
                  </a>
                );
              }
            })}
          </div>
        </section>
      </main>
      </div>

      {/* Footer Note */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-12 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-white/10 backdrop-blur-md inline-block p-3 rounded-full mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <p className="text-base opacity-90 max-w-3xl mx-auto leading-relaxed mb-4">
              This guide provides general information about family law in Kenya and should not be considered legal advice. For specific legal guidance tailored to your situation, please consult with a qualified family law advocate.
            </p>
            <p className="text-sm opacity-75">
              Last Updated: February 2026 | © {new Date().getFullYear()} Wakili. All rights reserved.
            </p>
          </div>
          
          <div className="border-t border-white/20 pt-8 grid md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center justify-center md:justify-start">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </h3>
              <p className="text-sm opacity-75">Available 24/7 for emergencies</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center justify-center md:justify-start">
                <Mail className="w-5 h-5 mr-2" />
                Get Support
              </h3>
              <p className="text-sm opacity-75">Free consultations available</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center justify-center md:justify-start">
                <Shield className="w-5 h-5 mr-2" />
                Your Privacy
              </h3>
              <p className="text-sm opacity-75">All consultations confidential</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FamilyLaw;
