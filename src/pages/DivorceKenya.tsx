import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Scale, FileText, Users, Heart, Shield, AlertCircle, Book, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, Clock, Gavel, FileCheck, CalendarDays, DollarSign, MapPin, MessageCircle, Mail } from 'lucide-react';

const DivorceKenya = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set comprehensive SEO meta tags
    document.title = 'Divorce in Kenya 2026 Complete Guide to Divorce Process, Grounds, Laws & Cost - Wakili';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Complete guide to divorce in Kenya 2026. Learn divorce grounds, process, timeline (6-24 months), cost (KES 50K-300K), types of marriages dissolution, Marriage Act 2014, Matrimonial Property Act 2013, required documents & court procedures.'
      );
    }

    // Add keywords meta tag
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 
      'divorce in Kenya, divorce process Kenya, divorce grounds Kenya, how to divorce in Kenya, divorce cost Kenya, Marriage Act 2014, divorce lawyer Kenya, uncontested divorce Kenya, contested divorce Kenya, divorce timeline Kenya, matrimonial property Kenya, decree nisi Kenya, decree absolute Kenya'
    );

    // Scroll to top
    window.scrollTo(0, 0);
    
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What are the grounds for divorce in Kenya under the Marriage Act 2014?",
      answer: "The sole ground for divorce is irretrievable breakdown of marriage, proven by: (1) Adultery - spouse committed adultery and petitioner finds it intolerable to live together; (2) Unreasonable behavior - spouse behaved in a way petitioner cannot reasonably be expected to live with them; (3) Desertion - continuous desertion for 3+ years; (4) Separation with consent - living apart for 3+ years with both consenting to divorce; (5) Separation without consent - living apart for 5+ years."
    },
    {
      question: "How long does a divorce take in Kenya in 2026?",
      answer: "Uncontested divorce takes 6-12 months from filing to decree nisi, plus 6 months waiting period for decree absolute (total 12-18 months). Contested divorce takes 12-24 months to decree nisi, plus 6 months for decree absolute (total 18-30+ months). Factors affecting duration include court backlogs, complexity of property division, custody disputes, and whether parties agree on terms."
    },
    {
      question: "How much does divorce cost in Kenya?",
      answer: "Total costs range from KES 50,000 to KES 300,000+. Breakdown: Court filing fees (KES 1,500-5,000), Lawyer fees uncontested (KES 50,000-100,000), Lawyer fees contested (KES 150,000-300,000+), Process server fees (KES 5,000-10,000), Valuation of property (KES 20,000-50,000), Mediation costs (KES 10,000-30,000). Costs increase with property disputes, custody battles, and appeals."
    },
    {
      question: "Can I get divorced without my spouse's consent in Kenya?",
      answer: "Yes, under Section 66(1)(e) of the Marriage Act 2014, you can petition for divorce without your spouse's consent if you have lived apart for a continuous period of at least 5 years. The respondent spouse can oppose the divorce on grounds of grave hardship, but the court will grant the divorce if the 5-year separation period is proven. Other grounds like adultery, unreasonable behavior, and desertion also don't require consent."
    },
    {
      question: "How is matrimonial property divided during divorce in Kenya?",
      answer: "Under the Matrimonial Property Act 2013, property acquired during marriage is presumed to be owned jointly, regardless of whose name it's in. The court considers both monetary and non-monetary contributions (including homemaking, childcare). Division aims to be equitable (fair), not necessarily equal. Factors include: marriage duration, each spouse's contributions, needs after divorce, age, health, income, standard of living during marriage, and custodial responsibilities for children."
    },
    {
      question: "What documents do I need to file for divorce in Kenya?",
      answer: "Required documents: (1) Original marriage certificate, (2) National ID or passport copies for both spouses, (3) Birth certificates of all children, (4) Evidence supporting grounds for divorce (e.g., medical reports for abuse, witness statements for adultery, separation agreements), (5) List of matrimonial property and valuations, (6) Financial statements showing income and assets, (7) Affidavit supporting the petition, (8) Memorandum of appearance (if respondent consents). Additional documents may be needed for specific circumstances."
    },
    {
      question: "Can I get divorced if I married under customary law?",
      answer: "Yes, customary marriages are recognized under the Marriage Act 2014 and can be dissolved through the same court process as other marriages. The petition is filed in the Family Division of the High Court or subordinate courts. The same grounds for divorce apply. However, if the customary marriage was not registered, you may first need to prove the marriage existed before seeking dissolution. Property division may also consider customary practices alongside the Matrimonial Property Act 2013."
    },
    {
      question: "What happens to children during divorce in Kenya?",
      answer: "Under the Children Act 2022, the best interests of the child are paramount. The court decides custody (sole, joint, or shared), access/visitation rights, and child maintenance. Both parents retain parental responsibility. Factors considered include: child's age and wishes, each parent's ability to care for the child, child's relationship with each parent, stability, safety, and willingness to facilitate access to other parent. Maintenance covers food, clothing, shelter, education, medical care until child turns 18 (or longer if in education)."
    },
    {
      question: "Can I stop my spouse from selling property during divorce proceedings?",
      answer: "Yes, you can apply for an injunction or restraining order to prevent your spouse from disposing of, selling, or transferring matrimonial property during divorce proceedings. This is done by filing an application in the same court where the divorce petition is filed. The court can freeze bank accounts, prevent property transfers, and appoint receivers to manage property. Violating such orders can result in contempt of court charges."
    },
    {
      question: "What is the difference between decree nisi and decree absolute?",
      answer: "Decree Nisi is a conditional divorce order issued by the court after being satisfied that grounds for divorce are proven. It's not a final divorce - parties are still legally married. Decree Absolute is the final order that officially dissolves the marriage, issued at least 6 months after decree nisi. Only after decree absolute can parties remarry. The 6-month waiting period allows time for reconciliation and ensures proper arrangements for children and property are finalized."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-0">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li><Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200 hover:scale-105"><Home className="w-4 h-4 mr-1" /> Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/family-law-divorce-kenya" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">Family Law</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">Divorce in Kenya</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-red-600 via-rose-600 to-pink-700 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <Gavel className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100">
                Divorce in Kenya 2026
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">Complete Legal Guide | Marriage Act 2014</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed mb-8">
            Comprehensive guide to divorce process, grounds, timeline, costs, and legal requirements in Kenya. <span className="font-semibold text-yellow-300">Updated for 2026 with latest case law and procedures.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need guidance on divorce in Kenya. Please advise on my situation and available services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Request guidance on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Guidance
            </a>
            <a
              href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Divorce Legal Services Request')}&body=${encodeURIComponent('Hello, I need guidance on divorce in Kenya. My situation:\\n\\n')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg border border-white/30 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Request guidance by email"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              Email Services
            </a>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <Clock className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-yellow-300" />
              <div className="text-2xl md:text-3xl font-bold mb-1">6-24 Months</div>
              <div className="text-xs md:text-sm opacity-90">Divorce Timeline</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-green-300" />
              <div className="text-2xl md:text-3xl font-bold mb-1">50K-300K</div>
              <div className="text-xs md:text-sm opacity-90">Cost Range (KES)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <FileCheck className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-blue-300" />
              <div className="text-2xl md:text-3xl font-bold mb-1">5 Grounds</div>
              <div className="text-xs md:text-sm opacity-90">Legal Grounds</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-purple-300" />
              <div className="text-2xl md:text-3xl font-bold mb-1">High Court</div>
              <div className="text-xs md:text-sm opacity-90">Jurisdiction</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        
        {/* Section 1: Legal Framework for Divorce */}
        <section className="mb-16 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="flex items-start mb-6 relative z-10">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-xl mr-4 mt-1 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Legal Framework Governing Divorce in Kenya</h2>
              
              <div className="space-y-6">
                {/* Primary Legislation */}
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Book className="w-6 h-6 text-blue-600 mr-2" />
                    The Marriage Act, 2014 (Primary Legislation)
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed"><strong>Section 66:</strong> Establishes irretrievable breakdown as the sole ground for divorce and defines five facts to prove it</p>
                    <p className="leading-relaxed"><strong>Section 67:</strong> Prohibits divorce petitions within 3 years of marriage (unless exceptional hardship or depravity)</p>
                    <p className="leading-relaxed"><strong>Section 68:</strong> Governs proceedings for decree of dissolution</p>
                    <p className="leading-relaxed"><strong>Section 69:</strong> Requires attempts at reconciliation before granting decree</p>
                    <p className="leading-relaxed"><strong>Section 70:</strong> Governs intervention by co-respondent in adultery cases</p>
                    <p className="leading-relaxed"><strong>Section 71:</strong> Allows withdrawal of petition with court permission</p>
                    <p className="leading-relaxed"><strong>Section 72:</strong> Establishes decree nisi and decree absolute process</p>
                    <p className="leading-relaxed"><strong>Section 73:</strong> Prevents remarriage until decree absolute is issued</p>
                    <p className="leading-relaxed"><strong>Section 74:</strong> Empowers court to make orders on matrimonial property</p>
                    <p className="leading-relaxed"><strong>Section 75:</strong> Governs custody and maintenance of children</p>
                  </div>
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700"><strong>Citation:</strong> Marriage Act, No. 4 of 2014, Laws of Kenya</p>
                    <p className="text-sm text-gray-700 mt-1"><strong>Date of Assent:</strong> 2nd May 2014 | <strong>Date of Commencement:</strong> Various provisions commenced on different dates in 2014-2015</p>
                  </div>
                </div>

                {/* Supporting Legislation */}
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Matrimonial Property Act, 2013",
                      color: "from-green-500 to-emerald-700",
                      provisions: [
                        "Section 2: Defines matrimonial property and matrimonial home",
                        "Section 6: Presumption of equal contribution to matrimonial property",
                        "Section 7: Recognition of monetary and non-monetary contributions",
                        "Section 9: Factors for determining contributions",
                        "Section 12: Division of matrimonial property upon divorce",
                        "Section 17: Protection of matrimonial home"
                      ],
                      citation: "Act No. 49 of 2013"
                    },
                    {
                      title: "Children Act, 2022",
                      color: "from-pink-500 to-rose-700",
                      provisions: [
                        "Section 4: Best interests of child as paramount consideration",
                        "Section 23: Parental responsibility framework",
                        "Section 24: Joint parental responsibility",
                        "Section 76: Maintenance obligations of both parents",
                        "Section 77: Determination of maintenance amount",
                        "Section 78: Enforcement of maintenance orders"
                      ],
                      citation: "Act No. 29 of 2022 (Revised)"
                    },
                    {
                      title: "Civil Procedure Act & Rules",
                      color: "from-purple-500 to-violet-700",
                      provisions: [
                        "Governs filing and service of divorce petitions",
                        "Order XXV: Proceedings in matrimonial causes",
                        "Establishes timelines for responses and hearings",
                        "Rules on evidence and witness examination",
                        "Procedures for interim applications",
                        "Appeals and review mechanisms"
                      ],
                      citation: "Cap. 21, Laws of Kenya"
                    },
                    {
                      title: "Constitution of Kenya, 2010",
                      color: "from-amber-500 to-orange-700",
                      provisions: [
                        "Article 45(3): Equal rights at dissolution of marriage",
                        "Article 27: Equality and non-discrimination",
                        "Article 53: Rights of children",
                        "Article 45(4): Recognition of all marriage types",
                        "Article 260: Definition of spouse",
                        "Bill of Rights: Fundamental freedoms"
                      ],
                      citation: "Constitution of Kenya, 2010"
                    }
                  ].map((act, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${act.color} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                      <h4 className="text-xl font-bold mb-4 flex items-center">
                        <Scale className="w-6 h-6 mr-2" />
                        {act.title}
                      </h4>
                      <ul className="space-y-2 mb-4">
                        {act.provisions.map((provision, pidx) => (
                          <li key={pidx} className="flex items-start text-sm">
                            <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{provision}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-xs">
                        <strong>Legal Citation:</strong> {act.citation}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Case Law */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Gavel className="w-6 h-6 mr-2" />
                    Relevant Case Law (Precedents)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-semibold mb-1">M.M v P.M (2014) eKLR</p>
                      <p className="text-xs opacity-90">Established principles for division of matrimonial property acquired during marriage</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-semibold mb-1">R.W v P.W.O (2015) eKLR</p>
                      <p className="text-xs opacity-90">Recognition of non-monetary contributions (homemaking, childcare) in property division</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-semibold mb-1">N.N v N.M (2017) eKLR</p>
                      <p className="text-xs opacity-90">Best interests of child paramount in custody determinations</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <p className="font-semibold mb-1">J.K.M v A.N.W (2019) eKLR</p>
                      <p className="text-xs opacity-90">Irretrievable breakdown must be proven by evidence, not mere allegations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How to File for Divorce in Kenya */}
        <section className="mb-16 bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-cyan-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-cyan-600 to-teal-700 p-4 rounded-xl mr-4 mt-1 shadow-lg">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-6">How to File for Divorce in Kenya: Step-by-Step Guide</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8 border-l-4 border-cyan-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Filing Requirements Overview</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Under <strong>Section 68 of the Marriage Act, 2014</strong>, a petition for dissolution of marriage must be filed in the <strong>Family Division of the High Court</strong> or in a subordinate court with jurisdiction over matrimonial matters.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <div className="font-bold text-cyan-700 mb-1">Jurisdiction</div>
                    <div className="text-sm text-gray-700">High Court Family Division</div>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <div className="font-bold text-teal-700 mb-1">Waiting Period</div>
                    <div className="text-sm text-gray-700">3 years from marriage date (Section 67)</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-bold text-blue-700 mb-1">Legal Basis</div>
                    <div className="text-sm text-gray-700">Marriage Act No. 4 of 2014</div>
                  </div>
                </div>
              </div>

              {/* Detailed Filing Steps */}
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Determine Your Eligibility to File",
                    color: "from-blue-500 to-cyan-600",
                    requirements: [
                      "You must have been married for at least 3 years (Section 67(1), Marriage Act 2014)",
                      "Exception: Court may allow petition within 3 years if petitioner suffered exceptional hardship or respondent shown exceptional depravity (Section 67(2))",
                      "Marriage must be legally valid and registered in Kenya",
                      "You or your spouse must be domiciled in Kenya, or have resided in Kenya for at least 3 years",
                      "You must have valid grounds for divorce under Section 66(1)"
                    ],
                    legalCitation: "Section 67, Marriage Act 2014: No petition before 3 years of marriage",
                    documents: ["Marriage certificate", "National ID/Passport", "Proof of residence in Kenya"]
                  },
                  {
                    step: 2,
                    title: "Gather Required Documents",
                    color: "from-purple-500 to-violet-600",
                    requirements: [
                      "Original marriage certificate issued by Registrar of Marriages",
                      "National ID or passport copies for both spouses",
                      "Birth certificates for all children of the marriage",
                      "Evidence supporting your ground for divorce (medical reports, witness statements, photos, etc.)",
                      "Comprehensive list of all matrimonial property with estimated values",
                      "Proof of ownership for properties (title deeds, sale agreements)",
                      "Bank statements for last 6-12 months",
                      "Valuation reports for significant assets",
                      "Income statements/payslips for both parties",
                      "Any prenuptial or postnuptial agreements"
                    ],
                    legalCitation: "Order XXV Rule 2, Civil Procedure Rules: Documents to accompany petition",
                    documents: ["Marriage certificate (original)", "IDs", "Children's birth certificates", "Property documents", "Financial statements", "Evidence of grounds"]
                  },
                  {
                    step: 3,
                    title: "Consult a Qualified Family Law Advocate",
                    color: "from-green-500 to-emerald-600",
                    requirements: [
                      "Find an advocate experienced in family law and divorce matters",
                      "Schedule initial consultation to discuss your case",
                      "Explain your grounds for divorce and present evidence",
                      "Discuss your objectives: custody, property division, maintenance",
                      "Get legal advice on strength of your case",
                      "Understand the likely timeline and costs",
                      "Negotiate fee structure (fixed fee vs hourly rate)",
                      "Sign engagement letter/retainer agreement"
                    ],
                    legalCitation: "Advocates Act, Cap 16: Legal representation by qualified advocate",
                    documents: ["Engagement letter", "Fee agreement", "Power of attorney (if needed)"],
                    notes: "While not mandatory, legal representation is highly recommended. Self-representation (litigant in person) is allowed but challenging."
                  },
                  {
                    step: 4,
                    title: "Draft the Petition for Dissolution",
                    color: "from-amber-500 to-orange-600",
                    requirements: [
                      "Petition must be in Form 1A (Matrimonial Causes Rules)",
                      "State full names, addresses, occupations of both parties",
                      "Provide marriage details: date, place, type of marriage",
                      "State ground(s) for divorce under Section 66(1)",
                      "Provide particulars and evidence of the ground",
                      "List all children: names, ages, current custody",
                      "Detail matrimonial property and proposed division",
                      "State prayers/claims: dissolution, custody, maintenance, property orders",
                      "Sign verification/declaration of truth",
                      "Have petition drafted by your advocate"
                    ],
                    legalCitation: "Section 68, Marriage Act 2014 & Order XXV, Civil Procedure Rules: Form and content of petition",
                    documents: ["Petition for dissolution (Form 1A)", "Supporting affidavit", "Annexures (marriage cert, evidence)"]
                  },
                  {
                    step: 5,
                    title: "Prepare Supporting Affidavit",
                    color: "from-red-500 to-rose-600",
                    requirements: [
                      "Affidavit must verify facts stated in petition",
                      "Chronologically detail marriage history and breakdown",
                      "Explain ground for divorce with specific dates and incidents",
                      "List attempts at reconciliation (if any)",
                      "Detail current custody arrangements for children",
                      "Explain proposed custody and access arrangements",
                      "State financial needs and maintenance requirements",
                      "Attach documentary evidence as exhibits",
                      "Swear/affirm before Commissioner for Oaths or Magistrate",
                      "Each page initialed, signature on last page"
                    ],
                    legalCitation: "Section 5, Oaths and Statutory Declarations Act, Cap 15: Affidavits must be sworn",
                    documents: ["Supporting affidavit", "Exhibits (evidence)", "Commissioner for Oaths stamp"]
                  },
                  {
                    step: 6,
                    title: "File Petition at High Court",
                    color: "from-indigo-500 to-purple-600",
                    requirements: [
                      "File at High Court Family Division in county where you or spouse resides",
                      "Submit original petition plus 2 copies",
                      "Submit original supporting affidavit plus 2 copies",
                      "Attach original marriage certificate (court retains this)",
                      "Attach copies of children's birth certificates",
                      "Attach list of matrimonial property",
                      "Pay filing fees (KES 1,500 - 5,000 depending on court)",
                      "Court assigns case number and registry file",
                      "Court issues summons to appear for respondent",
                      "Receive court-stamped copies for your records"
                    ],
                    legalCitation: "Article 165(3)(d)(iv), Constitution of Kenya 2010: High Court has jurisdiction in matrimonial matters",
                    documents: ["Filed petition (stamped)", "Summons to appear", "Filing fee receipt", "Case number"]
                  },
                  {
                    step: 7,
                    title: "Serve Petition on Respondent",
                    color: "from-pink-500 to-rose-600",
                    requirements: [
                      "Respondent must be personally served with petition and summons",
                      "Use court-appointed process server or private process server",
                      "Service must be within Kenya (if abroad, through Kenya embassy)",
                      "Process server delivers: petition, summons, marriage certificate copy",
                      "Respondent signs acknowledgment of service",
                      "If respondent evades service: apply for substituted service",
                      "Substituted service: publication in newspapers, posting at residence",
                      "Process server files affidavit of service in court",
                      "Service must be effected within 60 days of filing"
                    ],
                    legalCitation: "Order V, Civil Procedure Rules: Service of summons in matrimonial causes",
                    documents: ["Summons to appear", "Acknowledgment of service", "Affidavit of service"]
                  },
                  {
                    step: 8,
                    title: "Respondent's Response Period",
                    color: "from-teal-500 to-cyan-600",
                    requirements: [
                      "Respondent has 15 days from service to file memorandum of appearance",
                      "Respondent must state intention: defend, consent, or file cross-petition",
                      "If consenting: file consent form agreeing to divorce",
                      "If defending: file answer/defense within 21 days",
                      "If cross-petitioning: file cross-petition with own grounds",
                      "If no response: petitioner can apply for decree in default",
                      "Court may extend time for response on application"
                    ],
                    legalCitation: "Order XXV Rule 3, Civil Procedure Rules: Time for appearance and answer",
                    documents: ["Memorandum of appearance", "Answer/defense", "Consent form", "Cross-petition (if applicable)"]
                  },
                  {
                    step: 9,
                    title: "Attend Court-Ordered Reconciliation/Mediation",
                    color: "from-green-500 to-lime-600",
                    requirements: [
                      "Court must promote reconciliation (Section 69, Marriage Act 2014)",
                      "Court may refer parties to mediation before proceeding",
                      "Both parties attend mediation sessions",
                      "Discuss: grounds for divorce, property division, custody, maintenance",
                      "If reconciliation succeeds: petition withdrawn",
                      "If mediation achieves settlement: consent terms filed in court",
                      "If unsuccessful: mediator files report, case proceeds to trial/hearing",
                      "Mediation typically 1-3 sessions over 1-2 months"
                    ],
                    legalCitation: "Section 69, Marriage Act 2014: Court to promote reconciliation before granting decree",
                    documents: ["Mediation report", "Settlement agreement (if reached)", "Consent terms"]
                  },
                  {
                    step: 10,
                    title: "File Interim Applications (If Needed)",
                    color: "from-orange-500 to-amber-600",
                    requirements: [
                      "Apply for interim custody of children (best interests principle)",
                      "Apply for interim maintenance for self and/or children",
                      "Apply for injunction to prevent asset disposal",
                      "Apply for exclusive occupation of matrimonial home",
                      "Apply for protection orders (if domestic violence)",
                      "File notice of motion with supporting affidavit",
                      "Serve respondent and attend inter partes hearing",
                      "Court issues interim orders valid until final decree"
                    ],
                    legalCitation: "Sections 74-75, Marriage Act 2014: Power of court to make interim orders",
                    documents: ["Notice of motion", "Supporting affidavit", "Interim orders"]
                  },
                  {
                    step: 11,
                    title: "Attend Pre-Trial Conference",
                    color: "from-violet-500 to-purple-600",
                    requirements: [
                      "Court schedules pre-trial conference (both parties attend)",
                      "Identify agreed facts and contested issues",
                      "Exchange witness lists and documentary evidence",
                      "Narrow down issues for trial",
                      "Court gives directions on timelines",
                      "Set hearing/trial dates",
                      "Last opportunity to settle before trial"
                    ],
                    legalCitation: "Order XXV Rule 6, Civil Procedure Rules: Pre-trial conference in matrimonial causes",
                    documents: ["Pre-trial conference report", "Witness list", "List of documents"]
                  },
                  {
                    step: 12,
                    title: "Attend Trial/Hearing (Uncontested or Contested)",
                    color: "from-red-500 to-pink-600",
                    requirements: [
                      "Uncontested: Short hearing, petitioner testifies, court grants decree nisi",
                      "Contested: Full trial with examination of witnesses",
                      "Petitioner presents case first (evidence, witnesses)",
                      "Respondent defends (cross-examination, own witnesses)",
                      "Expert witnesses if needed (valuers, psychologists)",
                      "Both advocates make final submissions",
                      "Court may adjourn for judgment on later date"
                    ],
                    legalCitation: "Order XXV, Civil Procedure Rules: Trial of matrimonial causes",
                    documents: ["Witness statements", "Documentary exhibits", "Trial notes"]
                  },
                  {
                    step: 13,
                    title: "Court Judgment & Decree Nisi",
                    color: "from-blue-500 to-indigo-600",
                    requirements: [
                      "Court delivers judgment (oral or written)",
                      "If satisfied grounds proven: grants decree nisi",
                      "Decree nisi is conditional - not yet final divorce",
                      "Judgment includes orders on custody, maintenance, property",
                      "Either party can appeal within 30 days",
                      "Must wait 6 months before applying for decree absolute"
                    ],
                    legalCitation: "Section 72(1), Marriage Act 2014: Decree nisi granted when grounds proven",
                    documents: ["Judgment/ruling", "Decree nisi certificate", "Orders on ancillary matters"]
                  },
                  {
                    step: 14,
                    title: "Apply for Decree Absolute (Final Divorce)",
                    color: "from-emerald-500 to-green-600",
                    requirements: [
                      "Wait mandatory 6 months from decree nisi",
                      "File application for decree absolute (either party can apply)",
                      "Pay application fee (KES 1,000 - 2,000)",
                      "Court checks: no appeals pending, compliance with orders",
                      "Court grants decree absolute",
                      "Marriage is now legally dissolved",
                      "Parties free to remarry",
                      "Obtain certified copies for records/remarriage"
                    ],
                    legalCitation: "Section 72(2), Marriage Act 2014: Decree absolute makes dissolution final",
                    documents: ["Application for decree absolute", "Decree absolute certificate", "Certified copies"]
                  }
                ].map((stage) => (
                  <div key={stage.step} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-cyan-300 transition-all duration-300">
                    <div className={`bg-gradient-to-r ${stage.color} text-white p-6`}>
                      <div className="flex items-center mb-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center mr-4 font-bold text-2xl flex-shrink-0">
                          {stage.step}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold">{stage.title}</h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Requirements & Actions:</h4>
                        <div className="space-y-2">
                          {stage.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-start text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
                          <Scale className="w-4 h-4 text-purple-600 mr-2" />
                          Legal Citation
                        </h4>
                        <p className="text-sm text-gray-700 italic">{stage.legalCitation}</p>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2 text-sm">Key Documents:</h4>
                        <div className="flex flex-wrap gap-2">
                          {stage.documents.map((doc, idx) => (
                            <span key={idx} className="bg-white border border-amber-300 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {stage.notes && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700"><strong>Note:</strong> {stage.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Legal Notes */}
              <div className="mt-8 bg-gradient-to-r from-cyan-600 to-teal-700 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Critical Filing Requirements & Legal Provisions</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {[
                    "Jurisdiction: High Court Family Division per Article 165(3)(d)(iv), Constitution 2010",
                    "3-Year Bar: Section 67(1), Marriage Act 2014 - no petition within 3 years unless exceptional circumstances",
                    "Grounds: Must prove irretrievable breakdown per Section 66(1), Marriage Act 2014",
                    "Reconciliation: Mandatory under Section 69, Marriage Act 2014",
                    "Service: Personal service required per Order V, Civil Procedure Rules",
                    "Legal representation not mandatory but strongly advised",
                    "Court forms available from High Court registry or Kenya Law website",
                    "Filing fees vary by court location (KES 1,500 - 5,000)"
                  ].map((point, idx) => (
                    <div key={idx} className="flex items-start bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Five Grounds for Divorce - Detailed */}
        <section className="mb-16 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-red-200 group">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-red-600 to-rose-700 p-4 rounded-xl mr-4 mt-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">Five Legal Grounds for Divorce in Kenya</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-red-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Section 66(1) Marriage Act, 2014</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Single Ground:</strong> The sole ground for divorce is <span className="text-red-600 font-bold">irretrievable breakdown of marriage</span>.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Proof Required:</strong> The petitioner must prove irretrievable breakdown by establishing one or more of the following five facts:
                </p>
              </div>

              {/* Detailed Grounds */}
              <div className="space-y-6">
                {[
                  {
                    number: "1",
                    title: "Adultery",
                    legalBasis: "Section 66(1)(a), Marriage Act 2014",
                    color: "from-red-600 to-red-800",
                    definition: "The respondent has committed adultery and the petitioner finds it intolerable to live with the respondent.",
                    requirements: [
                      "Adultery must be voluntary sexual intercourse between a married person and someone other than their spouse",
                      "Petitioner must find it intolerable to live with respondent",
                      "Petition must be filed within 6 months of discovering the adultery",
                      "Continued cohabitation for more than 6 months after discovery may bar the petition",
                      "Brief periods of cohabitation (up to 6 months total) for reconciliation attempts don't bar petition"
                    ],
                    evidence: [
                      "Witness statements from persons who saw adultery or suspicious behavior",
                      "Electronic evidence (text messages, emails, social media)",
                      "Photos or video evidence",
                      "Admission by respondent or paramour",
                      "Hotel receipts, travel records",
                      "DNA evidence if paternity is disputed",
                      "Private investigator reports",
                      "Confession or acknowledgment of relationship"
                    ],
                    defenses: [
                      "Denial of adultery (respondent contests allegation)",
                      "Condonation (petitioner forgave and continued cohabitation)",
                      "Connivance (petitioner encouraged or facilitated the adultery)",
                      "Time bar (petition filed more than 6 months after discovery)"
                    ],
                    practicalNotes: [
                      "You don't need to name the person respondent committed adultery with, but you can cite them as co-respondent",
                      "Adultery alone isn't enough - you must also prove it's intolerable to live together",
                      "Standard of proof is 'balance of probabilities', not 'beyond reasonable doubt'",
                      "Court will not grant divorce if satisfied spouses have reconciled"
                    ]
                  },
                  {
                    number: "2",
                    title: "Unreasonable Behavior",
                    legalBasis: "Section 66(1)(b), Marriage Act 2014",
                    color: "from-orange-600 to-amber-700",
                    definition: "The respondent has behaved in such a way that the petitioner cannot reasonably be expected to live with the respondent.",
                    requirements: [
                      "Behavior must be such that petitioner cannot reasonably be expected to continue living with respondent",
                      "Test is objective: would a reasonable person in petitioner's position tolerate the behavior?",
                      "Behavior can be single serious incident or cumulative pattern",
                      "Mental illness of respondent doesn't prevent reliance on this ground",
                      "Negative behavior continuing despite opportunities to change"
                    ],
                    evidence: [
                      "Physical abuse: Medical reports (P3 forms), photos of injuries, hospital records",
                      "Verbal/emotional abuse: Witness statements, recorded conversations (with legal advice)",
                      "Financial irresponsibility: Bank statements, debt records, gambling records",
                      "Excessive drinking/drugs: Medical reports, police reports, witness accounts",
                      "Infidelity pattern: Evidence of multiple affairs or inappropriate relationships",
                      "Neglect: Evidence of failure to provide support, abandonment of duties",
                      "Criminal behavior: Court records, police reports, conviction records",
                      "Sexual misconduct: Refusal of relations, perverse demands, forced acts"
                    ],
                    examples: [
                      "Physical violence or assault",
                      "Persistent verbal abuse, insults, or threats",
                      "Excessive use of alcohol or drugs affecting family life",
                      "Compulsive gambling leading to financial hardship",
                      "Emotional cruelty or humiliation",
                      "Unreasonable sexual demands or refusal of intimacy",
                      "Association with criminals or bringing disrepute to family",
                      "Excessive controlling or domineering behavior",
                      "Persistent criticism or belittling",
                      "Financial irresponsibility or hiding assets",
                      "Forcing spouse to live with in-laws against their will",
                      "False accusations of infidelity or criminal conduct"
                    ],
                    defenses: [
                      "Denial that behavior occurred",
                      "Behavior was reasonable in the circumstances",
                      "Petitioner's conduct provoked the behavior",
                      "Petitioner continued living with respondent after the behavior, suggesting tolerance"
                    ],
                    practicalNotes: [
                      "This is the most flexible ground and commonly used",
                      "You can cite multiple instances of unreasonable behavior",
                      "Keep detailed records of incidents with dates and witnesses",
                      "Seek medical attention and police reports for violence"
                    ]
                  },
                  {
                    number: "3",
                    title: "Desertion",
                    legalBasis: "Section 66(1)(c), Marriage Act 2014",
                    color: "from-amber-600 to-yellow-700",
                    definition: "The respondent has deserted the petitioner for a continuous period of at least three years immediately preceding the presentation of the petition.",
                    requirements: [
                      "Desertion must be for continuous period of at least 3 years",
                      "Desertion must be without consent of petitioner",
                      "Desertion must be without reasonable cause",
                      "Deserting spouse must have intention to permanently end cohabitation",
                      "Petitioner must not have given cause for desertion through conduct"
                    ],
                    elements: [
                      "Factum of separation: Physical living apart",
                      "Animus deserendi: Intention to permanently end marriage",
                      "Absence of consent: Petitioner did not agree to separation",
                      "Absence of cause: No reasonable justification for leaving",
                      "Continuous period: 3+ years uninterrupted (reconciliation attempts interrupt period)"
                    ],
                    types: [
                      "Simple desertion: Respondent physically leaves matrimonial home",
                      "Constructive desertion: Respondent's conduct forces petitioner to leave",
                      "Desertion by exclusion: Respondent locks petitioner out or refuses re-entry"
                    ],
                    evidence: [
                      "Affidavit detailing date of desertion and circumstances",
                      "Witness statements from neighbors, family confirming absence",
                      "Communication records showing attempts to reconcile",
                      "Proof of petitioner's residence (utility bills, rent receipts)",
                      "Evidence respondent living elsewhere",
                      "Photos of locked-out petitioner (for constructive desertion)",
                      "Police reports if applicable"
                    ],
                    defenses: [
                      "Separation was by mutual consent",
                      "Petitioner's conduct gave reasonable cause for leaving",
                      "Separation was due to work or other justifiable reason",
                      "Desertion period interrupted by reconciliation attempts",
                      "Less than 3 years have elapsed"
                    ],
                    practicalNotes: [
                      "Temporary absences for work don't constitute desertion",
                      "If you were forced to leave due to abuse, it's constructive desertion by respondent",
                      "Keep records of attempts to contact deserting spouse",
                      "The 3-year period must be continuous and immediately before filing"
                    ]
                  },
                  {
                    number: "4",
                    title: "Separation (With Consent)",
                    legalBasis: "Section 66(1)(d), Marriage Act 2014",
                    color: "from-blue-600 to-cyan-700",
                    definition: "The parties to the marriage have lived apart for a continuous period of at least three years immediately preceding the presentation of the petition and both parties consent to the grant of a decree of dissolution.",
                    requirements: [
                      "Continuous living apart for at least 3 years",
                      "Both spouses consent to the divorce",
                      "Separation must be immediately before filing petition",
                      "Consent must be informed, voluntary, and genuine",
                      "Respondent must file memorandum of consent in court"
                    ],
                    advantages: [
                      "Fastest route to divorce when both agree",
                      "Less acrimonious than fault-based grounds",
                      "Lower legal costs as less contested",
                      "Reduces emotional stress on parties and children",
                      "Easier settlement of property and custody",
                      "Court proceedings are streamlined"
                    ],
                    livingApart: [
                      "Can live in same house but in separate arrangements (separate bedrooms, no shared meals, no intimacy)",
                      "Must cease to live as husband and wife",
                      "No cohabitation or marital relations",
                      "Financial arrangements should be separate where possible",
                      "Evidence needed: witness statements, separate utility bills if possible"
                    ],
                    consent: [
                      "Respondent must sign and file consent form in court",
                      "Consent can be withdrawn before decree nisi",
                      "Court must be satisfied consent is genuine and informed",
                      "Legal representation for both parties advisable",
                      "Consent must be to both separation and divorce"
                    ],
                    evidence: [
                      "Affidavits from both parties confirming separation date",
                      "Proof of separate residences (lease agreements, utility bills)",
                      "If living under one roof: evidence of separate arrangements",
                      "Witness statements from family/friends confirming separation",
                      "Separation agreement if formalized",
                      "Financial records showing separate accounts",
                      "Communication records showing cessation of marital relations"
                    ],
                    practicalNotes: [
                      "This is ideal for amicable divorces where both parties agree",
                      "Consider formalizing separation agreement covering property, children, maintenance",
                      "Reconciliation attempts interrupt the 3-year period",
                      "Both parties should seek independent legal advice on consent"
                    ]
                  },
                  {
                    number: "5",
                    title: "Separation (Without Consent)",
                    legalBasis: "Section 66(1)(e), Marriage Act 2014",
                    color: "from-indigo-600 to-purple-700",
                    definition: "The parties to the marriage have lived apart for a continuous period of at least five years immediately preceding the presentation of the petition.",
                    requirements: [
                      "Continuous living apart for at least 5 years",
                      "No consent needed from respondent spouse",
                      "Separation must be immediately before filing petition",
                      "Petitioner can unilaterally seek divorce",
                      "Must prove 5-year continuous separation period"
                    ],
                    advantages: [
                      "Doesn't require respondent's agreement or cooperation",
                      "Most certain ground - if 5 years proven, divorce will be granted",
                      "No need to prove fault or blame",
                      "Suitable when spouse has disappeared or refuses to engage",
                      "Removes requirement to prove adultery or bad behavior"
                    ],
                    respondentDefense: [
                      "Grave financial hardship: Divorce would cause respondent exceptional financial hardship",
                      "Grave hardship to children: Divorce would cause grave hardship to children",
                      "Other grave hardship: Any other circumstances causing exceptional hardship",
                      "Even if hardship proven, court may still grant divorce if dissolution is in interests of justice"
                    ],
                    evidence: [
                      "Detailed affidavit stating date separation began and circumstances",
                      "Proof of separate residences throughout 5-year period",
                      "Utility bills, rental agreements, mortgage statements",
                      "Witness statements from neighbors, family, friends",
                      "Employment records showing different addresses",
                      "School records for children showing parents live separately",
                      "Medical records with separate addresses",
                      "Communication records (or lack thereof)"
                    ],
                    hardshipConsiderations: [
                      "Court assesses financial impact on respondent (loss of benefits, pension rights, inheritance)",
                      "Social or religious implications",
                      "Health conditions that make divorce particularly difficult",
                      "Age and ability to adjust to new circumstances",
                      "Even with hardship, court balances against petitioner's right to divorce"
                    ],
                    practicalNotes: [
                      "Longest waiting period but most certain outcome",
                      "Useful when spouse refuses to cooperate with divorce",
                      "If spouse's location unknown, service by publication in newspapers",
                      "Respondent can oppose but rarely successfully after 5 years",
                      "Property and custody can still be contested even if divorce granted"
                    ]
                  }
                ].map((ground) => (
                  <div key={ground.number} className="bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-300">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${ground.color} text-white p-6`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center flex-1">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center mr-4 flex-shrink-0 font-bold text-2xl">
                            {ground.number}
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold">{ground.title}</h3>
                            <p className="text-sm opacity-90 mt-1">{ground.legalBasis}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-base md:text-lg leading-relaxed opacity-95 mt-4 italic bg-white/10 p-4 rounded-lg">
                        "{ground.definition}"
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50 space-y-6">
                      {/* Requirements */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                          Legal Requirements
                        </h4>
                        <ul className="space-y-2">
                          {ground.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start text-gray-700">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Additional Sections */}
                      {ground.elements && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">Four Elements of Desertion:</h4>
                          <ul className="space-y-1 text-sm">
                            {ground.elements.map((elem, idx) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>{elem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ground.types && (
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">Types of Desertion:</h4>
                          <ul className="space-y-1 text-sm">
                            {ground.types.map((type, idx) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <span className="text-purple-600 mr-2">•</span>
                                <span>{type}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ground.advantages && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">Advantages:</h4>
                          <ul className="space-y-1 text-sm">
                            {ground.advantages.map((adv, idx) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{adv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ground.examples && (
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">Examples of Unreasonable Behavior:</h4>
                          <div className="grid md:grid-cols-2 gap-2">
                            {ground.examples.map((example, idx) => (
                              <div key={idx} className="flex items-start text-gray-700 text-sm">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>{example}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evidence */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
                          <FileText className="w-5 h-5 text-blue-600 mr-2" />
                          Evidence Required
                        </h4>
                        <div className="grid gap-2">
                          {ground.evidence.map((ev, idx) => (
                            <div key={idx} className="flex items-start text-gray-700 bg-blue-50 p-3 rounded-lg">
                              <FileCheck className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{ev}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Defenses */}
                      {ground.defenses && (
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <Shield className="w-5 h-5 text-red-600 mr-2" />
                            Possible Defenses by Respondent
                          </h4>
                          <ul className="space-y-2">
                            {ground.defenses.map((def, idx) => (
                              <li key={idx} className="flex items-start text-gray-700 text-sm">
                                <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{def}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ground.respondentDefense && (
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                            <Shield className="w-5 h-5 text-red-600 mr-2" />
                            Respondent's Defense: Grave Hardship
                          </h4>
                          <ul className="space-y-2">
                            {ground.respondentDefense.map((def, idx) => (
                              <li key={idx} className="flex items-start text-gray-700 text-sm">
                                <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{def}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ground.hardshipConsiderations && (
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">Court's Hardship Considerations:</h4>
                          <ul className="space-y-1 text-sm">
                            {ground.hardshipConsiderations.map((cons, idx) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <span className="text-amber-600 mr-2">•</span>
                                <span>{cons}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ground.livingApart && (
                        <div className="bg-cyan-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">"Living Apart" Definition:</h4>
                          <ul className="space-y-1 text-sm">
                            {ground.livingApart.map((item, idx) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <span className="text-cyan-600 mr-2">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ground.consent && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2">Consent Requirements:</h4>
                          <ul className="space-y-1 text-sm">
                            {ground.consent.map((item, idx) => (
                              <li key={idx} className="flex items-start text-gray-700">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Practical Notes */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-l-4 border-indigo-600">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Book className="w-5 h-5 text-indigo-600 mr-2" />
                          Practical Notes
                        </h4>
                        <ul className="space-y-2">
                          {ground.practicalNotes.map((note, idx) => (
                            <li key={idx} className="flex items-start text-gray-700 text-sm">
                              <ArrowRight className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Box */}
              <div className="mt-8 bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4 flex items-center">
                  <Gavel className="w-6 h-6 mr-2" />
                  Key Points to Remember
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {[
                    "You can cite multiple grounds in one petition",
                    "Burden of proof lies with the petitioner",
                    "Standard is 'balance of probabilities' not 'beyond reasonable doubt'",
                    "Court may dismiss if convinced spouses have reconciled",
                    "Section 67: No petition within 3 years of marriage (except exceptional hardship)",
                    "Proper legal representation strongly recommended",
                    "Evidence must be admissible and credible",
                    "False allegations can result in dismissal and costs"
                  ].map((point, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="bg-white/20 rounded-full p-1 mr-2 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Types of Marriages and Dissolution */}
        <section className="mb-16 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-purple-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-pink-700 p-4 rounded-xl mr-4 mt-1 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">Types of Marriages in Kenya & How They're Dissolved</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-purple-600">
                <p className="text-gray-700 leading-relaxed mb-2">
                  The <strong>Marriage Act, 2014</strong> recognizes <strong className="text-purple-600">five types of marriages</strong> in Kenya. All can be dissolved through the same court process under the Act.
                </p>
                <p className="text-sm text-gray-600 italic">Section 6, Marriage Act 2014: Recognition of different marriage systems</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    type: "Christian Marriage",
                    color: "from-blue-500 to-cyan-600",
                    icon: "✝",
                    description: "Marriage solemnized in accordance with Christian rites and ceremonies",
                    requirements: [
                      "Solemnized by registered marriage officer (e.g., pastor, priest)",
                      "Both parties must consent voluntarily",
                      "Marriage must be registered with Registrar of Marriages",
                      "Marriage certificate issued after registration",
                      "Must be conducted in approved place of worship or registered venue"
                    ],
                    dissolution: [
                      "Dissolved through Family Division of High Court",
                      "Same grounds apply (Section 66, Marriage Act 2014)",
                      "Must produce marriage certificate as evidence",
                      "Church annulment is separate from legal divorce",
                      "Religious objections don't prevent legal divorce"
                    ],
                    notes: "Most common type in Kenya. Church annulment does not dissolve civil marriage - you must obtain legal divorce decree."
                  },
                  {
                    type: "Civil Marriage",
                    color: "from-green-500 to-emerald-600",
                    icon: "⚖",
                    description: "Marriage solemnized before a registrar or marriage officer without religious rites",
                    requirements: [
                      "Conducted by Registrar of Marriages or authorized officer",
                      "21-day notice period must be given",
                      "Two witnesses required",
                      "Marriage certificate issued immediately",
                      "Can be conducted at registry office or approved venue"
                    ],
                    dissolution: [
                      "Dissolved through High Court Family Division",
                      "All five grounds under Section 66 apply",
                      "Marriage certificate required",
                      "Typically faster to process than other types",
                      "No religious complications"
                    ],
                    notes: "Simplest form with no religious requirements. Popular for inter-faith couples and second marriages."
                  },
                  {
                    type: "Customary Marriage",
                    color: "from-amber-500 to-orange-600",
                    icon: "🌾",
                    description: "Marriage conducted according to customs and traditions of African communities",
                    requirements: [
                      "Conducted according to community's customs and traditions",
                      "Payment of dowry/bride price (if customary)",
                      "Consent of families/elders",
                      "Should be registered (though many are not)",
                      "Recognized even without registration if valid under custom"
                    ],
                    dissolution: [
                      "Dissolved through High Court under Marriage Act 2014",
                      "Same grounds apply as other marriages",
                      "If not registered, must first prove marriage existed",
                      "Evidence: witness testimony, dowry payment records, photos",
                      "Customary divorce processes don't legally dissolve marriage"
                    ],
                    notes: "Many customary marriages are unregistered. You may need to prove marriage existed before seeking dissolution. Customary 'divorce' processes (e.g., return of dowry) don't legally end the marriage."
                  },
                  {
                    type: "Islamic (Hindu) Marriage",
                    color: "from-teal-500 to-cyan-600",
                    icon: "☪",
                    description: "Marriage solemnized according to Islamic or Hindu rites and customs",
                    requirements: [
                      "Conducted by recognized Islamic/Hindu religious leader",
                      "According to respective religious laws and customs",
                      "Must be registered with Registrar of Marriages",
                      "Religious certificate issued (e.g., Nikaah certificate)",
                      "Civil registration required for legal recognition"
                    ],
                    dissolution: [
                      "Dissolved through High Court Family Division",
                      "Section 66 grounds apply to legal dissolution",
                      "Religious divorce (e.g., Talaq) doesn't legally end marriage",
                      "Must obtain court decree for legal divorce",
                      "Religious annulment separate from civil divorce"
                    ],
                    notes: "Religious divorce (Talaq, religious annulment) is separate from legal divorce. You must obtain High Court decree for marriage to be legally dissolved."
                  },
                  {
                    type: "Hindu Marriage",
                    color: "from-rose-500 to-pink-600",
                    icon: "🕉",
                    description: "Marriage solemnized according to Hindu rites and ceremonies",
                    requirements: [
                      "Conducted according to Hindu customs and rituals",
                      "Solemnized by Hindu priest or authorized person",
                      "Must be registered with Registrar of Marriages",
                      "Registration certificate issued",
                      "Various ceremonies (e.g., Saptapadi/seven steps)"
                    ],
                    dissolution: [
                      "Dissolved through High Court",
                      "All statutory grounds under Section 66 apply",
                      "Hindu religious divorce doesn't legally dissolve marriage",
                      "Court decree required",
                      "Religious and civil processes are separate"
                    ],
                    notes: "Like Islamic marriages, Hindu religious annulment/divorce doesn't legally end the marriage. Legal divorce decree from High Court is mandatory."
                  }
                ].map((marriage, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-300">
                    <div className={`bg-gradient-to-r ${marriage.color} text-white p-6`}>
                      <div className="flex items-center mb-2">
                        <div className="text-4xl mr-4">{marriage.icon}</div>
                        <div>
                          <h3 className="text-2xl font-bold">{marriage.type}</h3>
                          <p className="text-sm opacity-90 mt-1 italic">"{marriage.description}"</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Requirements */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                          Marriage Requirements
                        </h4>
                        <ul className="space-y-2">
                          {marriage.requirements.map((req, ridx) => (
                            <li key={ridx} className="flex items-start text-gray-700 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dissolution */}
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <Gavel className="w-5 h-5 text-red-600 mr-2" />
                          How This Marriage is Dissolved
                        </h4>
                        <ul className="space-y-2">
                          {marriage.dissolution.map((diss, didx) => (
                            <li key={didx} className="flex items-start text-gray-700 text-sm">
                              <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{diss}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Important Notes */}
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg border-l-4 border-amber-500">
                        <p className="text-sm text-gray-700">
                          <strong className="text-amber-700">Important:</strong> {marriage.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Points */}
              <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Critical Points About All Marriage Types</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {[
                    "All five marriage types are equal under law (Section 6, Marriage Act 2014)",
                    "Religious divorce/annulment does NOT legally dissolve marriage",
                    "You MUST obtain High Court decree for legal divorce",
                    "Unregistered marriages can be dissolved but require proof they existed",
                    "Same divorce grounds apply to all marriage types",
                    "Polygamous marriages: each union must be dissolved separately",
                    "Marriage certificate is critical evidence in divorce proceedings",
                    "If marriage certificate lost, obtain certified copy from Registrar"
                  ].map((point, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Detailed Divorce Process Timeline */}
        <section className="mb-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-indigo-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-4 rounded-xl mr-4 mt-1 shadow-lg">
              <CalendarDays className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">Complete Divorce Process & Timeline in Kenya</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8 border-l-4 border-indigo-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Due Process Overview</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Divorce proceedings in Kenya follow a structured legal process governed by the Marriage Act 2014 and Civil Procedure Rules. The process has <strong>10 major stages</strong> from consultation to final decree.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <strong className="text-green-700">Uncontested Divorce:</strong> 6-12 months to decree nisi + 6 months = <strong>12-18 months total</strong>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <strong className="text-red-700">Contested Divorce:</strong> 12-24 months to decree nisi + 6 months = <strong>18-30+ months total</strong>
                  </div>
                </div>
              </div>

              {/* Detailed Process Steps */}
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Initial Legal Consultation & Assessment",
                    duration: "1-2 weeks",
                    color: "from-blue-500 to-blue-700",
                    activities: [
                      "Meet with family law advocate/lawyer",
                      "Discuss grounds for divorce and evidence available",
                      "Review marriage certificate and relevant documents",
                      "Assess financial situation (assets, liabilities, income)",
                      "Discuss child custody and maintenance if applicable",
                      "Explore possibility of reconciliation or mediation",
                      "Get cost estimate for entire divorce process",
                      "Lawyer explains your rights and obligations"
                    ],
                    documents: ["Marriage certificate", "National IDs", "Birth certificates of children", "Property documents", "Bank statements", "Evidence of grounds (if available)"],
                    cost: "KES 10,000 - 30,000 (initial consultation)",
                    legalBasis: "Lawyer-client relationship established. Confidentiality guaranteed."
                  },
                  {
                    step: 2,
                    title: "Preparation & Filing of Petition",
                    duration: "1-2 weeks",
                    color: "from-indigo-500 to-indigo-700",
                    activities: [
                      "Lawyer drafts petition for dissolution of marriage",
                      "Petition states ground(s) for divorce with particulars",
                      "Include claims for custody, maintenance, property division",
                      "Prepare supporting affidavit with evidence",
                      "Gather and attach required documents",
                      "File petition at High Court Family Division",
                      "Pay court filing fees",
                      "Court assigns case number and judge"
                    ],
                    documents: ["Petition for dissolution", "Supporting affidavit", "Marriage certificate (original)", "Birth certificates of children", "List of matrimonial property", "Filing fee receipt"],
                    cost: "KES 1,500 - 5,000 (filing fees) + KES 20,000 - 50,000 (lawyer fees for drafting)",
                    legalBasis: "Section 68, Marriage Act 2014: Proceedings for decree of dissolution"
                  },
                  {
                    step: 3,
                    title: "Service of Petition on Respondent",
                    duration: "2-4 weeks",
                    color: "from-purple-500 to-purple-700",
                    activities: [
                      "Court issues summons to appear",
                      "Process server locates and serves respondent personally",
                      "Respondent receives petition, supporting documents, summons",
                      "If respondent evades service: substituted service (newspaper, posting)",
                      "Process server files affidavit of service",
                      "Respondent has 15 days to respond from date of service"
                    ],
                    documents: ["Petition", "Summons to appear", "Affidavit of service", "Acknowledgment of service (signed by respondent)"],
                    cost: "KES 5,000 - 15,000 (process server fees, publication if needed)",
                    legalBasis: "Order V, Civil Procedure Rules: Service of summons"
                  },
                  {
                    step: 4,
                    title: "Respondent's Response",
                    duration: "2-6 weeks",
                    color: "from-pink-500 to-rose-700",
                    activities: [
                      "Respondent files memorandum of appearance within 15 days",
                      "Option 1: Consent to divorce (sign consent form)",
                      "Option 2: Defend petition (file answer/defense)",
                      "Option 3: File cross-petition with own claims",
                      "Respondent may apply for interim orders (maintenance, custody)",
                      "If no response: petitioner can apply for decree in default",
                      "Respondent's lawyer reviews petition and advises"
                    ],
                    documents: ["Memorandum of appearance", "Answer/defense to petition", "Cross-petition (if filing)", "Consent form (if consenting)", "Counter-affidavit"],
                    cost: "KES 30,000 - 80,000 (respondent's lawyer fees if defending)",
                    legalBasis: "Order XXV Rule 3, Civil Procedure Rules: Answer to petition"
                  },
                  {
                    step: 5,
                    title: "Reconciliation & Mediation Attempts",
                    duration: "1-3 months",
                    color: "from-green-500 to-emerald-700",
                    activities: [
                      "Court may order parties to attempt reconciliation",
                      "Court-annexed mediation services provided",
                      "Private mediator can be engaged",
                      "Mediator facilitates discussions on all issues",
                      "If reconciliation succeeds: petition withdrawn",
                      "If fails: mediator files report to court",
                      "Mediation addresses: property, custody, maintenance, division"
                    ],
                    documents: ["Mediation agreement (if reached)", "Mediator's report to court", "Consent terms (if settled)"],
                    cost: "KES 10,000 - 30,000 (mediation fees, often free through court)",
                    legalBasis: "Section 69, Marriage Act 2014: Court to promote reconciliation"
                  },
                  {
                    step: 6,
                    title: "Interim Orders & Applications",
                    duration: "Variable (throughout process)",
                    color: "from-amber-500 to-orange-700",
                    activities: [
                      "Apply for interim custody of children",
                      "Apply for interim maintenance (spousal/child)",
                      "Apply for injunctions to prevent asset disposal",
                      "Apply for exclusive occupation of matrimonial home",
                      "Apply for restraining orders (domestic violence)",
                      "Court hears applications and issues temporary orders",
                      "Orders valid until final decree or varied by court"
                    ],
                    documents: ["Notice of motion", "Supporting affidavit", "Interim order issued by court", "Undertakings by parties"],
                    cost: "KES 5,000 - 20,000 per application + lawyer fees",
                    legalBasis: "Sections 74-75, Marriage Act 2014: Interim orders during proceedings"
                  },
                  {
                    step: 7,
                    title: "Pre-Trial Conference & Directions",
                    duration: "1-2 months",
                    color: "from-teal-500 to-cyan-700",
                    activities: [
                      "Court schedules pre-trial conference",
                      "Both parties and lawyers attend",
                      "Identify agreed and contested issues",
                      "Exchange lists of witnesses and documents",
                      "Court gives directions on timelines",
                      "Set hearing dates for trial",
                      "Last opportunity to settle before trial"
                    ],
                    documents: ["Pre-trial conference report", "List of witnesses", "List of documents", "Agreed facts (if any)", "Court directions"],
                    cost: "Included in lawyer's fees",
                    legalBasis: "Order XXVRule 6, Civil Procedure Rules: Pre-trial conference"
                  },
                  {
                    step: 8,
                    title: "Trial & Hearing (If Contested)",
                    duration: "2-6 months (multiple hearing dates)",
                    color: "from-red-500 to-rose-700",
                    activities: [
                      "Petitioner presents evidence and witnesses",
                      "Respondent cross-examines petitioner's witnesses",
                      "Respondent presents defense and witnesses",
                      "Petitioner cross-examines respondent's witnesses",
                      "Expert witnesses (valuers, psychologists) if needed",
                      "Submissions by both lawyers",
                      "Court may visit matrimonial property",
                      "Adjournments common due to court schedules"
                    ],
                    documents: ["Witness statements", "Expert reports", "Documentary exhibits", "Photos, videos, messages", "Medical reports (if violence alleged)"],
                    cost: "KES 100,000 - 300,000+ (lawyer fees for contested trial)",
                    legalBasis: "Order XXV, Civil Procedure Rules: Trial of matrimonial causes"
                  },
                  {
                    step: 9,
                    title: "Judgment & Decree Nisi",
                    duration: "1-3 months after trial",
                    color: "from-violet-500 to-purple-700",
                    activities: [
                      "Judge reviews evidence and submissions",
                      "Court issues written judgment",
                      "If satisfied: court grants decree nisi (conditional divorce)",
                      "Judgment covers: divorce, custody, maintenance, property",
                      "Decree nisi is not final - marriage not yet dissolved",
                      "Either party can appeal within 30 days",
                      "Must wait 6 months before applying for decree absolute"
                    ],
                    documents: ["Judgment/ruling", "Decree nisi certificate", "Orders on custody/property/maintenance", "Notice of appeal (if appealing)"],
                    cost: "Included in lawyer's fees",
                    legalBasis: "Section 72(1), Marriage Act 2014: Decree nisi granted if grounds proven"
                  },
                  {
                    step: 10,
                    title: "Decree Absolute (Final Divorce)",
                    duration: "6+ months after decree nisi",
                    color: "from-emerald-500 to-green-700",
                    activities: [
                      "Wait mandatory 6-month period from decree nisi",
                      "Either party applies for decree absolute",
                      "Court checks no appeals pending",
                      "Court ensures custody/maintenance orders complied with",
                      "Court issues decree absolute (final divorce order)",
                      "Marriage is now legally dissolved",
                      "Parties free to remarry",
                      "Decree absolute certificate issued"
                    ],
                    documents: ["Application for decree absolute", "Decree absolute certificate", "Certified copies for remarriage"],
                    cost: "KES 1,000 - 3,000 (application fee)",
                    legalBasis: "Section 72(2), Marriage Act 2014: Decree absolute dissolves marriage"
                  }
                ].map((stage) => (
                  <div key={stage.step} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-indigo-300 transition-all duration-300">
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${stage.color} text-white p-6`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center flex-1">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mr-4 font-bold text-3xl flex-shrink-0">
                            {stage.step}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{stage.title}</h3>
                            <div className="flex items-center mt-2 bg-white/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full text-sm">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{stage.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50">
                      {/* Activities */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                          <FileCheck className="w-5 h-5 text-blue-600 mr-2" />
                          Activities & Steps
                        </h4>
                        <div className="grid gap-2">
                          {stage.activities.map((activity, aidx) => (
                            <div key={aidx} className="flex items-start text-gray-700 text-sm bg-blue-50 p-3 rounded-lg">
                              <CheckCircle2 className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                          <FileText className="w-5 h-5 text-amber-600 mr-2" />
                          Required Documents
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {stage.documents.map((doc, didx) => (
                            <span key={didx} className="bg-white border border-amber-300 text-gray-700 px-3 py-1 rounded-full text-xs">
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Cost & Legal Basis */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                            Estimated Cost
                          </h4>
                          <p className="text-sm text-gray-700">{stage.cost}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                            <Scale className="w-5 h-5 text-purple-600 mr-2" />
                            Legal Basis
                          </h4>
                          <p className="text-sm text-gray-700">{stage.legalBasis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Comparison */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-8 rounded-xl shadow-xl">
                  <div className="flex items-center mb-4">
                    <CheckCircle2 className="w-10 h-10 mr-3" />
                    <h3 className="text-2xl font-bold">Uncontested Divorce</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center bg-white/20 p-3 rounded-lg">
                      <Clock className="w-5 h-5 mr-2" />
                      <span><strong>6-12 months</strong> to decree nisi</span>
                    </div>
                    <div className="flex items-center bg-white/20 p-3 rounded-lg">
                      <Clock className="w-5 h-5 mr-2" />
                      <span><strong>+6 months</strong> waiting period</span>
                    </div>
                    <div className="flex items-center bg-yellow-300 text-yellow-900 p-3 rounded-lg font-bold">
                      <CalendarDays className="w-5 h-5 mr-2" />
                      <span>Total: 12-18 months</span>
                    </div>
                    <p className="mt-4 text-xs opacity-90">Both parties agree on all terms. Minimal court appearances. Lower legal costs.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-rose-700 text-white p-8 rounded-xl shadow-xl">
                  <div className="flex items-center mb-4">
                    <AlertCircle className="w-10 h-10 mr-3" />
                    <h3 className="text-2xl font-bold">Contested Divorce</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center bg-white/20 p-3 rounded-lg">
                      <Clock className="w-5 h-5 mr-2" />
                      <span><strong>12-24 months</strong> to decree nisi</span>
                    </div>
                    <div className="flex items-center bg-white/20 p-3 rounded-lg">
                      <Clock className="w-5 h-5 mr-2" />
                      <span><strong>+6 months</strong> waiting period</span>
                    </div>
                    <div className="flex items-center bg-yellow-300 text-yellow-900 p-3 rounded-lg font-bold">
                      <CalendarDays className="w-5 h-5 mr-2" />
                      <span>Total: 18-30+ months</span>
                    </div>
                    <p className="mt-4 text-xs opacity-90">Disputes over grounds, property, custody. Full trial required. Multiple hearings. Higher legal costs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Comprehensive Cost Breakdown */}
        <section className="mb-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-green-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-4 rounded-xl mr-4 mt-1 shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">Complete Cost Breakdown: Divorce in Kenya 2026</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8 border-l-4 border-green-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Total Expected Costs</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300">
                    <div className="text-green-700 text-sm font-semibold mb-2">UNCONTESTED DIVORCE</div>
                    <div className="text-4xl font-bold text-green-700 mb-2">KES 50K - 150K</div>
                    <p className="text-sm text-gray-600">Lower end if amicable settlement, minimal legal work</p>
                  </div>
                  <div className="bg-red-50 p-6 rounded-xl border-2 border-red-300">
                    <div className="text-red-700 text-sm font-semibold mb-2">CONTESTED DIVORCE</div>
                    <div className="text-4xl font-bold text-red-700 mb-2">KES 150K - 500K+</div>
                    <p className="text-sm text-gray-600">Higher end for complex property/custody disputes, appeals</p>
                  </div>
                </div>
              </div>

              {/* Detailed Cost Items */}
              <div className="space-y-6">
                {[
                  {
                    category: "Court Filing Fees",
                    icon: <Gavel className="w-6 h-6" />,
                    color: "from-blue-500 to-cyan-600",
                    items: [
                      { item: "Petition for dissolution of marriage", range: "KES 1,500 - 3,000", notes: "Varies by court location" },
                      { item: "Affidavit stamping", range: "KES 200 - 500", notes: "Per affidavit filed" },
                      { item: "Notice of motion (interim applications)", range: "KES 1,000 - 2,000", notes: "Per application" },
                      { item: "Application for decree absolute", range: "KES 1,000 - 2,000", notes: "Final divorce application" },
                      { item: "Certified copy of decree", range: "KES 500 - 1,000", notes: "For remarriage, records" },
                      { item: "Process service fees", range: "KES 2,000 - 5,000", notes: "If respondent evades service" }
                    ],
                    total: "KES 6,200 - 13,500"
                  },
                  {
                    category: "Lawyer/Advocate Fees",
                    icon: <Scale className="w-6 h-6" />,
                    color: "from-purple-500 to-violet-600",
                    items: [
                      { item: "Initial consultation (1-2 hours)", range: "KES 10,000 - 30,000", notes: "Varies by lawyer experience" },
                      { item: "Petition drafting & filing", range: "KES 20,000 - 50,000", notes: "Includes research and filing" },
                      { item: "Representation (uncontested)", range: "KES 50,000 - 100,000", notes: "Full service to decree nisi" },
                      { item: "Representation (contested - trial)", range: "KES 150,000 - 300,000+", notes: "Multiple hearings, trial days" },
                      { item: "Interim applications (per application)", range: "KES 10,000 - 30,000", notes: "Custody, injunctions, etc." },
                      { item: "Mediation attendance", range: "KES 15,000 - 40,000", notes: "Per mediation session" },
                      { item: "Appeals to Court of Appeal", range: "KES 200,000 - 500,000+", notes: "If decree is appealed" }
                    ],
                    total: "KES 50,000 - 300,000+ (depends on complexity)",
                    notes: "Senior advocates charge significantly more. Negotiate fees upfront. Some lawyers offer payment plans."
                  },
                  {
                    category: "Property Valuation & Experts",
                    icon: <FileCheck className="w-6 h-6" />,
                    color: "from-orange-500 to-amber-600",
                    items: [
                      { item: "Real estate valuation", range: "KES 20,000 - 50,000", notes: "Per property, by registered valuer" },
                      { item: "Business valuation", range: "KES 50,000 - 200,000", notes: "For family businesses" },
                      { item: "Pension/retirement benefits valuation", range: "KES 10,000 - 30,000", notes: "Actuarial valuation" },
                      { item: "Forensic accountant", range: "KES 100,000 - 300,000", notes: "If financial fraud suspected" },
                      { item: "Child psychologist report", range: "KES 30,000 - 80,000", notes: "For custody disputes" },
                      { item: "Private investigator", range: "KES 50,000 - 150,000", notes: "For evidence of adultery, etc." }
                    ],
                    total: "KES 20,000 - 500,000+ (if expert evidence needed)",
                    notes: "Only necessary in contested cases with significant assets or custody disputes"
                  },
                  {
                    category: "Mediation & Alternative Dispute Resolution",
                    icon: <Users className="w-6 h-6" />,
                    color: "from-teal-500 to-cyan-600",
                    items: [
                      { item: "Court-annexed mediation", range: "Free - KES 10,000", notes: "Often provided by court at no cost" },
                      { item: "Private mediator (per session)", range: "KES 20,000 - 50,000", notes: "2-4 hour sessions" },
                      { item: "Full mediation package (3-5 sessions)", range: "KES 50,000 - 150,000", notes: "Until settlement reached" },
                      { item: "Drafting settlement agreement", range: "KES 10,000 - 30,000", notes: "By lawyer or mediator" }
                    ],
                    total: "Free - KES 150,000",
                    notes: "Highly recommended - can save 50-70% of litigation costs"
                  },
                  {
                    category: "Miscellaneous Costs",
                    icon: <FileText className="w-6 h-6" />,
                    color: "from-pink-500 to-rose-600",
                    items: [
                      { item: "Certified copies of documents", range: "KES 2,000 - 5,000", notes: "Marriage cert, judgments, etc." },
                      { item: "Travel to/from court", range: "KES 5,000 - 20,000", notes: "Multiple court dates" },
                      { item: "Translation services", range: "KES 10,000 - 30,000", notes: "If documents in other languages" },
                      { item: "Newspaper publication (if substituted service)", range: "KES 10,000 - 25,000", notes: "If spouse can't be located" },
                      { item: "Commissioner for oaths fees", range: "KES 500 - 2,000", notes: "For swearing affidavits" },
                      { item: "Photocopying, printing, binding", range: "KES 2,000 - 10,000", notes: "Court documents, bundles" }
                    ],
                    total: "KES 10,000 - 50,000"
                  }
                ].map((category, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-transparent hover:border-green-300 transition-all duration-300">
                    <div className={`bg-gradient-to-r ${category.color} text-white p-6`}>
                      <div className="flex items-center mb-2">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{category.category}</h3>
                          <p className="text-sm opacity-90 mt-1">Estimated Total: <strong>{category.total}</strong></p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-3">
                        {category.items.map((cost, cidx) => (
                          <div key={cidx} className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500 hover:bg-green-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-gray-900">{cost.item}</span>
                              <span className="font-bold text-green-700 ml-4">{cost.range}</span>
                            </div>
                            <p className="text-sm text-gray-600 italic">{cost.notes}</p>
                          </div>
                        ))}
                      </div>
                      
                      {category.notes && (
                        <div className="mt-4 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                          <p className="text-sm text-gray-700"><strong>Note:</strong> {category.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost-Saving Tips */}
              <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 rounded-xl shadow-xl">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <CheckCircle2 className="w-7 h-7 mr-3" />
                  10 Ways to Reduce Divorce Costs
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {[
                    "Opt for uncontested divorce through mediation/negotiation",
                    "Agree on major issues (property, custody) before filing",
                    "Choose experienced but reasonably-priced lawyer",
                    "Negotiate fixed-fee arrangement vs hourly billing",
                    "Respond to all deadlines promptly (avoid court costs for delays)",
                    "Prepare and organize all documents yourself",
                    "Use court-annexed mediation (often free)",
                    "Avoid unnecessary interim applications",
                    "Be realistic about property division expectations",
                    "Consider Legal Aid if you qualify (income < KES 30,000/month)"
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-start bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                      <div className="bg-yellow-400 text-yellow-900 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Aid Information */}
              <div className="mt-6 bg-blue-50 p-6 rounded-xl border-2 border-blue-300">
                <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 mr-2" />
                  Legal Aid Available
                </h4>
                <p className="text-gray-700 mb-4">
                  If you cannot afford a lawyer, you may qualify for <strong>free legal aid</strong> from the National Legal Aid Service (NLAS).
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-blue-700">Eligibility:</strong>
                    <ul className="mt-2 space-y-1 text-gray-700">
                      <li>• Monthly income below KES 30,000</li>
                      <li>• Unable to afford private lawyer</li>
                      <li>• Kenyan citizen or legal resident</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-blue-700">Services Covered:</strong>
                    <ul className="mt-2 space-y-1 text-gray-700">
                      <li>• Legal advice and representation</li>
                      <li>• Drafting and filing of petition</li>
                      <li>• Court representation</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 bg-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Contact NLAS:</strong> Visit <span className="text-blue-700 font-semibold">www.nlskenya.org</span> or call <strong>0800 720 559</strong> (toll-free)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="mb-16 relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-8 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md inline-block p-4 rounded-full mb-6">
              <Scale className="w-12 h-12" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Need Help with Your Divorce?</h2>
            <p className="text-xl md:text-2xl mb-8 opacity-95 max-w-3xl mx-auto">
              Connect with experienced divorce lawyers in Kenya for expert legal guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Link to="/register" className="group bg-white text-blue-700 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105">
                <Users className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Find a Divorce Lawyer
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contactus" className="group bg-transparent border-3 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105">
                <FileText className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Free Consultation
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-90">Divorce Lawyers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm opacity-90">Success Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Legal Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 md:p-10 border border-indigo-200">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl mr-4 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            Frequently Asked Questions About Divorce in Kenya
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
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 pr-4">{faq.question}</h3>
                  </div>
                  <div className={`ml-4 transition-transform duration-300 flex-shrink-0 ${openFaq === index ? 'rotate-180' : ''}`}>
                    {openFaq === index ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-screen' : 'max-h-0'}`}>
                  <div className="p-6 pt-0 bg-gradient-to-b from-blue-50 to-white">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md inline-block p-3 rounded-full mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <p className="text-base opacity-90 max-w-3xl mx-auto leading-relaxed mb-4">
            This guide provides general information about divorce in Kenya and should not be considered legal advice. Laws and procedures may change. For specific legal guidance tailored to your situation, please consult with a qualified family law advocate.
          </p>
          <p className="text-sm opacity-75">
            Last Updated: February 2026 | Based on Marriage Act 2014, Matrimonial Property Act 2013, Children Act 2022
          </p>
          <p className="text-sm opacity-75 mt-2">
            © {new Date().getFullYear()} Wakili. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DivorceKenya;
