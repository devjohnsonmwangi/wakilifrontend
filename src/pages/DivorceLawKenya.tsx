import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Scale, FileText, Book, ChevronDown, ChevronUp, CheckCircle2, Gavel, Shield, AlertCircle, BookOpen, Landmark, FileCheck, MessageCircle, Mail } from 'lucide-react';

const DivorceLawKenya = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.title = 'Divorce Law in Kenya 2026 Complete Legal Framework, Acts, Articles & Statutes';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Comprehensive guide to divorce law in Kenya. All relevant Acts cited: Marriage Act 2014, Matrimonial Property Act 2013, Children Act 2022, Constitution of Kenya 2010, Civil Procedure Rules. Complete legal framework and statutory provisions.'
      );
    }

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', 
      'divorce law Kenya, Marriage Act 2014, Matrimonial Property Act 2013, Children Act 2022, divorce legislation Kenya, family law Kenya, marriage dissolution law, Kenya divorce statutes, Article 45 Constitution Kenya, Section 66 Marriage Act'
    );

    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the primary law governing divorce in Kenya?",
      answer: "The Marriage Act, 2014 (Act No. 4 of 2014) is the primary legislation governing divorce in Kenya. It consolidated all previous marriage laws and provides the legal framework for dissolution of all types of marriages. Section 66 establishes irretrievable breakdown as the sole ground for divorce, while Section 68 governs the proceedings for dissolution."
    },
    {
      question: "What does Article 45 of the Constitution say about marriage and divorce?",
      answer: "Article 45(3) of the Constitution of Kenya 2010 provides that parties to a marriage are entitled to equal rights at the time of the marriage, during the marriage, and at the dissolution of the marriage. This constitutional provision ensures equality and non-discrimination in divorce proceedings and property division, regardless of gender."
    },
    {
      question: "What is Section 66 of the Marriage Act 2014?",
      answer: "Section 66(1) establishes that the sole ground for granting a decree of dissolution of marriage is that the marriage has broken down irretrievably. Section 66(1)(a-e) lists five facts that prove irretrievable breakdown: adultery, unreasonable behavior, desertion for 3+ years, separation with consent for 3+ years, and separation without consent for 5+ years."
    },
    {
      question: "How does the Matrimonial Property Act 2013 apply to divorce?",
      answer: "The Matrimonial Property Act, 2013 (Act No. 49 of 2013) governs division of property upon divorce. Section 6 presumes equal contribution to matrimonial property. Section 7 recognizes both monetary and non-monetary contributions (homemaking, childcare). Section 12 empowers courts to divide matrimonial property equitably upon divorce, considering contributions, needs, and other factors under Section 9."
    },
    {
      question: "What role does the Children Act 2022 play in divorce cases?",
      answer: "The Children Act, 2022 (Act No. 29 of 2022) governs all matters concerning children in divorce proceedings. Section 4 makes the best interests of the child the paramount consideration. Section 23 defines parental responsibility. Section 76 establishes maintenance obligations of both parents. The Act ensures children's welfare is protected during and after divorce."
    },
    {
      question: "What are the Civil Procedure Rules in divorce cases?",
      answer: "Order XXV of the Civil Procedure Act (Cap 21, Laws of Kenya) specifically governs proceedings in matrimonial causes. It prescribes the procedure for filing petitions, service of process, filing of answers, pre-trial conferences, and trial of divorce cases. These rules must be strictly followed to ensure procedural validity."
    },
    {
      question: "Can courts make interim orders during divorce proceedings?",
      answer: "Yes. Sections 74 and 75 of the Marriage Act 2014 empower courts to make interim orders on custody, maintenance, and property during divorce proceedings. These temporary orders remain in effect until the final decree or until varied by the court. They ensure protection of vulnerable parties pending final determination."
    },
    {
      question: "What is Section 67 of the Marriage Act about?",
      answer: "Section 67(1) prohibits filing a divorce petition within three years of marriage. Section 67(2) creates an exception: the court may allow a petition within 3 years if the petitioner has suffered exceptional hardship or the respondent has shown exceptional depravity. This provision aims to give marriages a reasonable chance before dissolution."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-2 sm:py-3 px-2 sm:px-4 md:px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-0">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li><Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200"><Home className="w-4 h-4 mr-1" /> Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/family-law-divorce-kenya" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">Family Law</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">Divorce Law in Kenya</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <Scale className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Divorce Law in Kenya
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">Complete Legal Framework & Statutory Provisions</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed">
            Comprehensive overview of all Acts, Articles, Sections, and legal provisions governing divorce and marriage dissolution in Kenya. <span className="font-semibold text-yellow-300">Updated for 2026.</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        
        {/* Section 1: Constitution of Kenya 2010 */}
        <section className="mb-16 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <Landmark className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need guidance on divorce law in Kenya. Please advise on legal procedures and services.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  aria-label="Request guidance on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  WhatsApp Guidance
                </a>
                <a
                  href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Divorce Law Legal Services Request')}&body=${encodeURIComponent('Hello, I need guidance on divorce law in Kenya.\\n\\n')}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg border border-white/30 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  aria-label="Request guidance by email"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  Email Services
                </a>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Constitution of Kenya, 2010</h2>
              
              <div className="space-y-6">
                {/* Article 45 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Book className="w-6 h-6 text-blue-600 mr-2" />
                    Article 45: Family
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-bold text-blue-900 mb-2">Article 45(1)</div>
                      <p className="text-gray-700 italic">"The family is the natural and fundamental unit of society and the necessary basis of social order, and shall enjoy the recognition and protection of the State."</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-bold text-blue-900 mb-2">Article 45(2)</div>
                      <p className="text-gray-700 italic">"Every adult has the right to marry a person of the opposite sex, based on the free consent of the parties."</p>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-400">
                      <div className="font-bold text-indigo-900 mb-2">Article 45(3) - CRITICAL FOR DIVORCE</div>
                      <p className="text-gray-700 italic mb-3">"Parties to a marriage are entitled to equal rights at the time of the marriage, during the marriage and at the dissolution of the marriage."</p>
                      <div className="bg-white p-3 rounded mt-2">
                        <p className="text-sm text-gray-700"><strong>Legal Significance:</strong> This constitutional provision guarantees equality between spouses in divorce proceedings, property division, custody decisions, and all ancillary matters. No discrimination based on gender is permitted.</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-bold text-blue-900 mb-2">Article 45(4)</div>
                      <p className="text-gray-700 italic">"Parliament shall enact legislation that recognizes—</p>
                      <ul className="mt-2 ml-6 space-y-1 text-gray-700 text-sm">
                        <li>(a) marriages concluded under any tradition, or system of religious, personal or family law; and</li>
                        <li>(b) any system of personal and family law under any tradition, or adhered to by persons professing a particular religion, to the extent that any such marriages or systems of law are consistent with this Constitution."</li>
                      </ul>
                      <div className="bg-white p-3 rounded mt-2">
                        <p className="text-sm text-gray-700"><strong>Implementation:</strong> This provision led to enactment of the Marriage Act, 2014, which recognizes all five types of marriages in Kenya.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Article 27 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-6 h-6 text-green-600 mr-2" />
                    Article 27: Equality and Freedom from Discrimination
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-bold text-green-900 mb-2">Article 27(1)</div>
                      <p className="text-gray-700 italic">"Every person is equal before the law and has the right to equal protection and equal benefit of the law."</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-bold text-green-900 mb-2">Article 27(3)</div>
                      <p className="text-gray-700 italic">"Women and men have the right to equal treatment, including the right to equal opportunities in political, economic, cultural and social spheres."</p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-bold text-green-900 mb-2">Article 27(4)</div>
                      <p className="text-gray-700 italic">"The State shall not discriminate directly or indirectly against any person on any ground, including race, sex, pregnancy, marital status, health status, ethnic or social origin, colour, age, disability, religion, conscience, belief, culture, dress, language or birth."</p>
                    </div>

                    <div className="bg-white p-3 rounded border-l-4 border-green-500 mt-3">
                      <p className="text-sm text-gray-700"><strong>Application to Divorce:</strong> Courts must treat both parties equally regardless of gender, socioeconomic status, or other factors. Property division, custody, and maintenance decisions must be based on merit and statutory provisions, not stereotypes.</p>
                    </div>
                  </div>
                </div>

                {/* Article 53 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-pink-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileCheck className="w-6 h-6 text-pink-600 mr-2" />
                    Article 53: Children
                  </h3>
                  
                  <div className="bg-pink-50 p-4 rounded-lg mb-3">
                    <div className="font-bold text-pink-900 mb-2">Article 53(1)</div>
                    <p className="text-gray-700 italic mb-3">"Every child has the right—</p>
                    <ul className="ml-6 space-y-2 text-gray-700 text-sm">
                      <li>(a) to a name and nationality from birth;</li>
                      <li>(b) to free and compulsory basic education;</li>
                      <li>(c) to basic nutrition, shelter and health care;</li>
                      <li>(d) to be protected from abuse, neglect, harmful cultural practices, all forms of violence, inhuman treatment and punishment, and hazardous or exploitative labour;</li>
                      <li>(e) to parental care and protection, which includes equal responsibility of the mother and father to provide for the child, whether they are married to each other or not; and</li>
                      <li>(f) not to be detained, except as a measure of last resort..."</li>
                    </ul>
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="font-bold text-pink-900 mb-2">Article 53(2)</div>
                    <p className="text-gray-700 italic">"A child's best interests are of paramount importance in every matter concerning the child."</p>
                  </div>

                  <div className="bg-white p-3 rounded border-l-4 border-pink-500 mt-3">
                    <p className="text-sm text-gray-700"><strong>Application to Divorce:</strong> In custody and access decisions, children's best interests override parents' preferences. Both parents retain equal responsibility to provide for children regardless of divorce. This provision is reinforced by the Children Act, 2022.</p>
                  </div>
                </div>

                {/* Article 165 */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Gavel className="w-6 h-6 text-purple-600 mr-2" />
                    Article 165(3)(d)(iv): Jurisdiction of High Court
                  </h3>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-700 italic mb-3">"The High Court has— (3)(d) jurisdiction to hear any question respecting— (iv) the status of persons, including matrimonial causes;"</p>
                    
                    <div className="bg-white p-3 rounded mt-3">
                      <p className="text-sm text-gray-700"><strong>Legal Significance:</strong> This constitutional provision vests the High Court with exclusive original jurisdiction to hear and determine all divorce petitions and matrimonial causes. Subordinate courts can only hear such matters if specifically empowered by legislation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Marriage Act 2014 - Detailed */}
        <section className="mb-16 bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-rose-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-rose-600 to-red-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-6">The Marriage Act, 2014 (Act No. 4 of 2014)</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-rose-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed mb-2">The Marriage Act, 2014 is the principal legislation governing marriage and divorce in Kenya. It consolidated and repealed:</p>
                <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
                  <li>African Christian Marriage and Divorce Act (Cap 151)</li>
                  <li>Hindu Marriage and Divorce Act (Cap 157)</li>
                  <li>Mohammedan Marriage, Divorce and Succession Act (Cap 156)</li>
                  <li>Matrimonial Causes Act (Cap 152)</li>
                </ul>
                <div className="mt-3 bg-rose-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700"><strong>Date of Assent:</strong> 2nd May 2014 | <strong>Commencement:</strong> Various provisions (2014-2015)</p>
                </div>
              </div>

              {/* Key Definitions from Marriage Act */}
              <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-rose-300 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-7 h-7 text-rose-600 mr-3" />
                  Section 3: Interpretation - Key Definitions from Marriage Act 2014
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-rose-50 p-5 rounded-lg border-l-4 border-rose-600">
                    <div className="font-bold text-rose-900 mb-3 text-lg">"Irretrievable Breakdown"</div>
                    <p className="text-gray-700 mb-3">While not explicitly defined in Section 3, Section 66 establishes this as the sole ground for divorce:</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Legal Meaning:</strong> Marriage has broken down irretrievably means the marriage relationship has deteriorated to such an extent that there is no reasonable possibility of spouses resuming a normal marital relationship. This must be proven by establishing one or more of the five facts in Section 66(1)(a-e).</p>
                      <p className="text-sm text-gray-700 mt-2"><strong>Important:</strong> You cannot simply claim breakdown - you must PROVE it through adultery, unreasonable behavior, desertion, or separation.</p>
                    </div>
                  </div>

                  <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-600">
                    <div className="font-bold text-red-900 mb-3 text-lg">"Adultery" (Section 66(1)(a))</div>
                    <p className="text-gray-700 mb-3">Defined in common law and applied in Marriage Act context:</p>
                    <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                      <p className="text-gray-700"><strong>Definition:</strong> Voluntary sexual intercourse between a married person and someone who is not their spouse.</p>
                      <p className="text-gray-700"><strong>Requirements to prove:</strong></p>
                      <ul className="ml-4 space-y-1 text-gray-700">
                        <li>• Sexual intercourse actually occurred (not just emotional affair)</li>
                        <li>• It was voluntary (not rape/assault)</li>
                        <li>• Evidence: witness testimony, electronic evidence, admission, DNA (if child born)</li>
                        <li>• Must also prove petitioner finds it intolerable to live with respondent</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-600">
                    <div className="font-bold text-orange-900 mb-3 text-lg">"Desertion" (Section 66(1)(c))</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> One spouse abandons the other without consent and without reasonable cause for a continuous period of at least 3 years.</p>
                      <p className="text-sm text-gray-700"><strong>Four Elements Required (established by case law):</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700 mt-2">
                        <li>• <strong>Factum of separation:</strong> Physical living apart</li>
                        <li>• <strong>Animus deserendi:</strong> Intention to permanently end the marriage</li>
                        <li>• <strong>Absence of consent:</strong> Deserted spouse didn't agree to separation</li>
                        <li>• <strong>Absence of cause:</strong> No reasonable justification for leaving</li>
                      </ul>
                      <p className="text-sm text-gray-700 mt-2"><strong>Note:</strong> Includes constructive desertion (spouse's conduct forces other to leave)</p>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-600">
                    <div className="font-bold text-amber-900 mb-3 text-lg">"Living Apart" (Sections 66(1)(d) and (e))</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition (from case law):</strong> Spouses cease to live together as husband and wife, even if under same roof.</p>
                      <p className="text-sm text-gray-700"><strong>Requirements:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700 mt-2">
                        <li>• No cohabitation (no sexual relations)</li>
                        <li>• Living separate lives (separate meals, bedrooms, finances)</li>
                        <li>• No mutual support or companionship</li>
                        <li>• Can be in same house but separate arrangements</li>
                        <li>• Must be continuous for 3 years (with consent) or 5 years (without consent)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-600">
                    <div className="font-bold text-blue-900 mb-3 text-lg">"Decree Nisi" (Section 72(1))</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> A conditional or provisional decree of divorce granted by the court when satisfied that grounds for divorce are proven.</p>
                      <p className="text-sm text-gray-700"><strong>Legal Effect:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700 mt-2">
                        <li>• Marriage not yet dissolved - spouses still legally married</li>
                        <li>• Cannot remarry until decree absolute</li>
                        <li>• Valid for 6 months minimum before decree absolute can be applied for</li>
                        <li>• Can be appealed within 30 days</li>
                        <li>• Orders on custody, maintenance, property are final unless appealed</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-600">
                    <div className="font-bold text-indigo-900 mb-3 text-lg">"Decree Absolute" (Section 72(2))</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> The final decree that conclusively dissolves the marriage.</p>
                      <p className="text-sm text-gray-700"><strong>Legal Effect:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700 mt-2">
                        <li>• Marriage is now legally ended</li>
                        <li>• Both parties free to remarry</li>
                        <li>• Obtained minimum 6 months after decree nisi</li>
                        <li>• Either party can apply for it</li>
                        <li>• Certificate serves as proof for remarriage</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-600">
                    <div className="font-bold text-purple-900 mb-3 text-lg">"Reconciliation" (Section 69)</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> The process of spouses resuming their marital relationship and resolving differences that led to divorce petition.</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Section 69 states:</strong> "Before granting a decree of dissolution of a marriage, the Court shall satisfy itself that there is no reasonable possibility of reconciliation between the parties to the marriage."</p>
                      <p className="text-sm text-gray-700"><strong>Court's Duty:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700 mt-2">
                        <li>• Must promote reconciliation attempts</li>
                        <li>• May adjourn proceedings for reconciliation</li>
                        <li>• Can refer parties to mediation/counseling</li>
                        <li>• If reconciliation successful, petition withdrawn</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-teal-50 p-5 rounded-lg border-l-4 border-teal-600">
                    <div className="font-bold text-teal-900 mb-3 text-lg">"Exceptional Hardship/Depravity" (Section 67(2))</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Context:</strong> Exception to the 3-year bar on filing divorce petitions.</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>"Exceptional Hardship"</strong> - suffering by petitioner that is:</p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• Extreme and unusual</li>
                        <li>• Beyond normal marital difficulties</li>
                        <li>• Examples: severe domestic violence, life-threatening abuse, intentional transmission of disease, extreme mental cruelty</li>
                      </ul>
                      <p className="text-sm text-gray-700 mt-2"><strong>"Exceptional Depravity"</strong> - conduct by respondent that is:</p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• Morally reprehensible and extreme</li>
                        <li>• Examples: sexual abuse, torture, perverse sexual demands, criminal conduct endangering family</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Sections on Divorce */}
              <div className="space-y-6">
                {/* Section 66 */}
                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-rose-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Scale className="w-7 h-7 text-rose-600 mr-3" />
                    Section 66: Ground for Decree of Dissolution
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-rose-50 p-5 rounded-lg border-l-4 border-rose-600">
                      <div className="font-bold text-rose-900 mb-3 text-lg">Section 66(1)</div>
                      <p className="text-gray-700 italic mb-4">"The sole ground on which a petition for a decree of dissolution of a marriage may be presented shall be that the marriage has broken down irretrievably."</p>
                      
                      <div className="bg-white p-4 rounded-lg mt-3">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Section 66(1) continues:</p>
                        <p className="text-gray-700 text-sm italic mb-3">"The Court may grant a decree of dissolution of marriage upon being satisfied that the marriage has broken down irretrievably if, but only if, one or more of the following facts is proved—</p>
                        
                        <div className="space-y-3 mt-3">
                          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                            <strong className="text-blue-900">(a) Adultery</strong>
                            <p className="text-gray-700 text-sm mt-1">"that the respondent has committed adultery and the petitioner finds it intolerable to live with the respondent;"</p>
                          </div>

                          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                            <strong className="text-green-900">(b) Unreasonable Behavior</strong>
                            <p className="text-gray-700 text-sm mt-1">"that the respondent has behaved in such a way that the petitioner cannot reasonably be expected to live with the respondent;"</p>
                          </div>

                          <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500">
                            <strong className="text-amber-900">(c) Desertion</strong>
                            <p className="text-gray-700 text-sm mt-1">"that the respondent has deserted the petitioner for a continuous period of at least three years immediately preceding the presentation of the petition;"</p>
                          </div>

                          <div className="bg-cyan-50 p-3 rounded border-l-4 border-cyan-500">
                            <strong className="text-cyan-900">(d) Separation with Consent</strong>
                            <p className="text-gray-700 text-sm mt-1">"that the parties to the marriage have lived apart for a continuous period of at least three years immediately preceding the presentation of the petition and both parties consent to the grant of a decree of dissolution;"</p>
                          </div>

                          <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
                            <strong className="text-purple-900">(e) Separation without Consent</strong>
                            <p className="text-gray-700 text-sm mt-1">"that the parties to the marriage have lived apart for a continuous period of at least five years immediately preceding the presentation of the petition."</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-50 p-4 rounded-lg">
                      <div className="font-bold text-rose-900 mb-2">Section 66(2)</div>
                      <p className="text-gray-700 text-sm italic">"On a petition on the basis of the fact in subsection (1)(d), a decree shall not be granted unless the Court is satisfied that the respondent consents to the grant of the decree."</p>
                    </div>

                    <div className="bg-rose-50 p-4 rounded-lg">
                      <div className="font-bold text-rose-900 mb-2">Section 66(3)</div>
                      <p className="text-gray-700 text-sm italic">"The Court hearing a petition on the basis of the fact in subsection (1)(e) shall not grant a decree if the respondent satisfies the Court that the dissolution would result in grave financial or other hardship, and that it would in all circumstances be wrong to grant the decree."</p>
                    </div>
                  </div>
                </div>

                {/* Section 67 */}
                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-orange-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-7 h-7 text-orange-600 mr-3" />
                    Section 67: Restriction on Petitions Within Three Years
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-600">
                      <div className="font-bold text-orange-900 mb-3">Section 67(1)</div>
                      <p className="text-gray-700 italic">"Subject to subsection (2), no petition for a decree of dissolution of a marriage shall be presented to the Court before the expiration of three years from the date of the marriage."</p>
                    </div>

                    <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-600">
                      <div className="font-bold text-orange-900 mb-3">Section 67(2) - Exception</div>
                      <p className="text-gray-700 italic mb-3">"Subsection (1) shall not apply if the Court is satisfied that the case is one of exceptional hardship suffered by the petitioner or of exceptional depravity on the part of the respondent."</p>
                      
                      <div className="bg-white p-3 rounded mt-3">
                        <p className="text-sm text-gray-700"><strong>Examples of Exceptional Hardship/Depravity:</strong></p>
                        <ul className="text-sm text-gray-700 ml-4 mt-2 space-y-1">
                          <li>• Severe physical or sexual abuse</li>
                          <li>• Life-threatening domestic violence</li>
                          <li>• Spouse contracting serious disease through reckless behavior</li>
                          <li>• Extreme cruelty or torture</li>
                          <li>• Criminal conduct endangering petitioner's life</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="font-bold text-orange-900 mb-2">Section 67(3)</div>
                      <p className="text-gray-700 text-sm italic">"In determining an application under subsection (2), the Court shall have regard to the interests of any child of the marriage and to the question whether there is reasonable probability of a reconciliation between the parties during the period of three years from the date of the marriage."</p>
                    </div>
                  </div>
                </div>

                {/* Additional Critical Sections - Compact Format */}
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      section: "Section 68",
                      title: "Proceedings for Decree of Dissolution",
                      color: "blue",
                      content: "Governs filing and procedure for divorce petitions. Petition must state ground(s), particulars, and claims for custody, maintenance, and property. Filed in High Court Family Division."
                    },
                    {
                      section: "Section 69",
                      title: "Duty to Promote Reconciliation",
                      color: "green",
                      content: "Court must satisfy itself there's no reasonable possibility of reconciliation before granting decree. May adjourn proceedings and refer parties to mediation. Mandatory reconciliation attempts."
                    },
                    {
                      section: "Section 70",
                      title: "Intervention by Co-Respondent",
                      color: "purple",
                      content: "In adultery cases, person alleged to have committed adultery with respondent may be made co-respondent and can defend the petition or claim costs."
                    },
                    {
                      section: "Section 71",
                      title: "Withdrawal of Petition",
                      color: "amber",
                      content: "Petitioner may withdraw petition at any time before final decree with permission of Court. If reconciliation achieved, petition withdrawn without prejudice."
                    },
                    {
                      section: "Section 72",
                      title: "Decree Nisi and Decree Absolute",
                      color: "rose",
                      content: "Section 72(1): Court grants decree nisi if grounds proven. Section 72(2): Decree absolute granted 6+ months after decree nisi. Only decree absolute dissolves marriage. Parties can remarry after decree absolute."
                    },
                    {
                      section: "Section 73",
                      title: "Remarriage After Dissolution",
                      color: "indigo",
                      content: "No party to dissolved marriage shall remarry until decree absolute granted. Remarriage before decree absolute is void and may constitute bigamy."
                    },
                    {
                      section: "Section 74",
                      title: "Orders for Matrimonial Property",
                      color: "teal",
                      content: "Court may make orders on division of matrimonial property during divorce proceedings. Must consider Matrimonial Property Act 2013. Can order sale, partition, or transfer of property."
                    },
                    {
                      section: "Section 75",
                      title: "Orders for Custody and Maintenance",
                      color: "orange",
                      content: "Court may make orders on custody, access, and maintenance of children. Best interests of child paramount. Can make interim and final orders. Both parents responsible for maintenance."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className={`bg-gradient-to-br from-${item.color}-50 to-white p-5 rounded-xl shadow-lg border-l-4 border-${item.color}-500 hover:shadow-xl transition-all duration-300`}>
                      <h4 className={`text-lg font-bold text-${item.color}-900 mb-2`}>{item.section}</h4>
                      <div className={`text-sm font-semibold text-${item.color}-700 mb-3`}>{item.title}</div>
                      <p className="text-gray-700 text-sm leading-relaxed">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Matrimonial Property Act 2013 */}
        <section className="mb-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-green-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">Matrimonial Property Act, 2013 (Act No. 49 of 2013)</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed mb-2">This Act provides for the rights and responsibilities of spouses in relation to matrimonial property, and for connected purposes. It establishes the legal framework for ownership, management, and division of property between married spouses.</p>
                <div className="mt-3 bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700"><strong>Date of Assent:</strong> 14th January 2013 | <strong>Commencement:</strong> 2013 | <strong>Long Title:</strong> "An Act of Parliament to provide for the rights and responsibilities of spouses in relation to matrimonial property, and for connected purposes"</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Comprehensive Definitions Section */}
                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-green-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-7 h-7 text-green-600 mr-3" />
                    Section 2: Interpretation - Complete Legal Definitions
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Matrimonial Property */}
                    <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-600">
                      <div className="font-bold text-green-900 mb-3 text-lg">"Matrimonial Property"</div>
                      <p className="text-gray-700 italic mb-3">"matrimonial property" means—</p>
                      <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                        <p className="text-gray-700"><strong>(a)</strong> the matrimonial home or homes; and</p>
                        <p className="text-gray-700"><strong>(b)</strong> household goods and effects in the matrimonial home; and</p>
                        <p className="text-gray-700"><strong>(c)</strong> any other immovable and movable property jointly owned and acquired during the subsistence of the marriage;</p>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg mt-3">
                        <p className="text-sm text-gray-700"><strong>What This Means:</strong> Matrimonial property includes the family home(s), all furniture and appliances in the home, and ANY property (land, buildings, vehicles, investments, business assets) acquired by either or both spouses during the marriage. It doesn't matter whose name the property is registered in - if acquired during marriage, it's presumed to be matrimonial property.</p>
                      </div>
                    </div>

                    {/* Matrimonial Home */}
                    <div className="bg-emerald-50 p-5 rounded-lg border-l-4 border-emerald-600">
                      <div className="font-bold text-emerald-900 mb-3 text-lg">"Matrimonial Home"</div>
                      <p className="text-gray-700 italic mb-3">"matrimonial home" means any property, including household goods and effects, jointly or separately owned—</p>
                      <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                        <p className="text-gray-700"><strong>(a)</strong> that the spouses have agreed to use as the family residence; or</p>
                        <p className="text-gray-700"><strong>(b)</strong> that the spouses ordinarily use as the family residence;</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg mt-3">
                        <p className="text-sm text-gray-700"><strong>What This Means:</strong> The matrimonial home is the house/apartment where the family actually lives, regardless of who owns it. Even if only one spouse's name is on the title deed, it's still the matrimonial home if the family lives there. Can include multiple homes if family uses them (e.g., town home and rural home).</p>
                      </div>
                    </div>

                    {/* Monetary Contribution */}
                    <div className="bg-teal-50 p-5 rounded-lg border-l-4 border-teal-600">
                      <div className="font-bold text-teal-900 mb-3 text-lg">"Monetary Contribution"</div>
                      <p className="text-gray-700 italic mb-3">"monetary contribution" means—</p>
                      <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                        <p className="text-gray-700"><strong>(a)</strong> monetary payment or payment in kind;</p>
                        <p className="text-gray-700"><strong>(b)</strong> payment of deposits and instalments towards the purchase of the property; and</p>
                        <p className="text-gray-700"><strong>(c)</strong> other financial resources expended for the benefit of the common interest of both spouses;</p>
                      </div>
                      <div className="bg-cyan-50 p-4 rounded-lg mt-3">
                        <p className="text-sm text-gray-700"><strong>Examples:</strong> Salary/wages paid towards household, down payment for house/car, mortgage payments, paying for renovations, school fees for children, medical bills, business capital, savings and investments, insurance premiums, loan repayments for family benefit.</p>
                      </div>
                    </div>

                    {/* Non-Monetary Contribution */}
                    <div className="bg-lime-50 p-5 rounded-lg border-l-4 border-lime-600">
                      <div className="font-bold text-lime-900 mb-3 text-lg">"Non-Monetary Contribution"</div>
                      <p className="text-gray-700 italic mb-3">"non-monetary contribution" includes—</p>
                      <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                        <p className="text-gray-700"><strong>(a)</strong> domestic work and management of the matrimonial home;</p>
                        <p className="text-gray-700"><strong>(b)</strong> child care;</p>
                        <p className="text-gray-700"><strong>(c)</strong> companionship;</p>
                        <p className="text-gray-700"><strong>(d)</strong> management of family business or property; and</p>
                        <p className="text-gray-700"><strong>(e)</strong> farm work;</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg mt-3">
                        <p className="text-sm text-gray-700"><strong>Critical Legal Principle:</strong> The law recognizes that homemaking, childcare, and other non-financial contributions are EQUALLY VALUABLE as monetary contributions. A spouse who stays home to raise children has contributed just as much as the spouse who earns income. This applies to Section 7 - both types of contributions given equal weight.</p>
                      </div>
                    </div>

                    {/* Household Goods and Effects */}
                    <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-600">
                      <div className="font-bold text-blue-900 mb-3 text-lg">"Household Goods and Effects"</div>
                      <p className="text-gray-700 mb-3">While not explicitly defined in Section 2, case law and practice interpret this to mean:</p>
                      <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                        <p className="text-gray-700">• Furniture (beds, sofas, tables, chairs, wardrobes)</p>
                        <p className="text-gray-700">• Appliances (TV, fridge, cooker, washing machine, microwave)</p>
                        <p className="text-gray-700">• Kitchenware (utensils, crockery, cutlery)</p>
                        <p className="text-gray-700">• Electronics (computers, phones, sound systems)</p>
                        <p className="text-gray-700">• Bedding, linen, curtains, carpets</p>
                        <p className="text-gray-700">• Decorations and artwork</p>
                        <p className="text-gray-700">• Tools and equipment for household use</p>
                      </div>
                    </div>

                    {/* Spouse */}
                    <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-600">
                      <div className="font-bold text-purple-900 mb-3 text-lg">"Spouse"</div>
                      <p className="text-gray-700 italic mb-3">"spouse" means a party to a marriage;</p>
                      <div className="bg-white p-4 rounded-lg mt-3">
                        <p className="text-sm text-gray-700"><strong>Per Article 260, Constitution of Kenya 2010:</strong> "spouse" includes a husband or wife, and parties to a marriage. This covers all five types of marriages recognized under the Marriage Act 2014 (Christian, Civil, Customary, Islamic, Hindu).</p>
                      </div>
                    </div>

                    {/* Separation */}
                    <div className="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-600">
                      <div className="font-bold text-amber-900 mb-3 text-lg">"Separation"</div>
                      <p className="text-gray-700 mb-3">While the Matrimonial Property Act doesn't define separation, Section 3 references it:</p>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2"><strong>Section 3(1):</strong> "The rights and responsibilities of spouses under this Act shall apply during the subsistence of the marriage and upon the termination of the marriage by death, divorce or <strong>separation</strong>."</p>
                        <p className="text-sm text-gray-700"><strong>Legal Interpretation:</strong> Separation means living apart without divorce. Property rights continue during separation. Under Marriage Act 2014, separation for 3+ years (with consent) or 5+ years (without consent) can be grounds for divorce.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Critical Provisions */}
                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-green-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Scale className="w-7 h-7 text-green-600 mr-3" />
                    Section 3: Application of the Act
                  </h3>
                  <div className="bg-green-50 p-5 rounded-lg space-y-4">
                    <div>
                      <div className="font-bold text-green-900 mb-2">Section 3(1)</div>
                      <p className="text-gray-700 text-sm italic mb-2">"The rights and responsibilities of spouses under this Act shall apply during the subsistence of the marriage and upon the termination of the marriage by death, divorce or separation."</p>
                      <div className="bg-white p-3 rounded mt-2">
                        <p className="text-sm text-gray-700"><strong>Meaning:</strong> Property rights exist throughout marriage, during divorce proceedings, and after divorce. Even separated couples retain property rights until formal divorce.</p>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-green-900 mb-2">Section 3(2)</div>
                      <p className="text-gray-700 text-sm italic mb-2">"Where a marriage is polygamous, subsection (1) shall apply to each spousal union."</p>
                      <div className="bg-white p-3 rounded mt-2">
                        <p className="text-sm text-gray-700"><strong>Meaning:</strong> In polygamous marriages, each wife has independent property rights. Property division considered separately for each spousal relationship.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-emerald-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <FileCheck className="w-7 h-7 text-emerald-600 mr-3" />
                    Section 4: Ownership of Matrimonial Property
                  </h3>
                  <div className="bg-emerald-50 p-5 rounded-lg space-y-4">
                    <div>
                      <div className="font-bold text-emerald-900 mb-2">Section 4(1)</div>
                      <p className="text-gray-700 text-sm italic mb-2">"A spouse shall not be deprived of ownership or possession of any property on account of the nature, form or circumstances of the acquisition of the property."</p>
                      <div className="bg-white p-3 rounded mt-2">
                        <p className="text-sm text-gray-700"><strong>Critical Principle:</strong> Cannot be denied property rights because property is in other spouse's name, purchased by other spouse, or because you didn't work outside home. Homemaker has equal rights.</p>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900 mb-2">Section 4(2)</div>
                      <p className="text-gray-700 text-sm italic">"Ownership of matrimonial property vests in the spouses according to the contribution of either spouse towards its acquisition, and shall be divided between the spouses if they divorce or their marriage is otherwise dissolved."</p>
                      <div className="bg-white p-3 rounded mt-2">
                        <p className="text-sm text-gray-700"><strong>Meaning:</strong> Ownership based on contribution (monetary AND non-monetary). Upon divorce, property must be divided considering these contributions.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-teal-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-7 h-7 text-teal-600 mr-3" />
                    Section 5: Right to Information on Matrimonial Property
                  </h3>
                  <div className="bg-teal-50 p-5 rounded-lg">
                    <p className="text-gray-700 text-sm italic mb-3">"Each spouse shall have a right to information concerning any property in which either or both have an interest."</p>
                    <div className="bg-white p-4 rounded-lg space-y-2">
                      <p className="text-sm text-gray-700"><strong>What This Means:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• Spouse entitled to know about all family property and assets</li>
                        <li>• Can demand disclosure of property details, values, debts</li>
                        <li>• Cannot be kept in dark about family finances</li>
                        <li>• During divorce, both parties must file full financial disclosure</li>
                        <li>• Hiding assets is contempt of court and affects property division</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Key Sections */}
                {[
                  {
                    section: "Section 2",
                    title: "Interpretation - Key Definitions (Continued)",
                    content: [
                      "'Matrimonial property' means the matrimonial home or homes and household goods and effects in the matrimonial home and any other immovable and movable property jointly owned and acquired during the subsistence of the marriage",
                      "'Matrimonial home' means any property, including household goods and effects, jointly or separately owned, that the spouses have agreed to use as the family residence or the spouses ordinarily use as the family residence",
                      "'Non-monetary contribution' includes domestic work and management of the matrimonial home, child care, companionship, management of family business or property and farm work",
                      "'Monetary contribution' means monetary payment or payment in kind, including payment of deposits and instalments for property and other financial resources expended for the benefit of the common interest of spouses"
                    ],
                    color: "green"
                  },
                  {
                    section: "Section 6",
                    title: "Presumption of Equal Contribution",
                    content: [
                      "Section 6(1): There shall be a presumption of equal contribution between spouses in the acquisition of matrimonial property during the subsistence of the marriage",
                      "Section 6(2): The presumption of equal contribution in subsection (1) shall apply irrespective of whether or not the matrimonial property is registered in the names of both or either of the spouses",
                      "Section 6(3): The presumption in subsection (1) may be rebutted by evidence showing the extent of contribution by each spouse",
                      "This is a rebuttable presumption - party claiming unequal contribution must prove it with evidence"
                    ],
                    color: "emerald"
                  },
                  {
                    section: "Section 7",
                    title: "Recognition of Monetary and Non-Monetary Contributions",
                    content: [
                      "In determining the share of each spouse to matrimonial property, the contribution of each spouse to the acquisition of that property shall be taken into account",
                      "Both monetary and non-monetary contributions shall be given equal weight",
                      "Non-monetary contributions include: domestic work, childcare, homemaking, companionship, management of household or family business",
                      "Courts must not discriminate against homemakers or primary caregivers",
                      "Contribution assessment is holistic, not mathematical"
                    ],
                    color: "teal"
                  },
                  {
                    section: "Section 9",
                    title: "Factors for Determining Contribution",
                    content: [
                      "(a) The extent of the contributions made by each spouse in money, property or work towards the acquisition of the property",
                      "(b) Any debts owing by either spouse which were contracted for the joint benefit and which affect the extent of the beneficial interest in the property",
                      "(c) The needs of the spouses and of any children of the marriage",
                      "(d) Such other factors as the court considers relevant in determining the interest of a spouse in matrimonial property",
                      "(e) The provisions of section 7 (recognition of non-monetary contributions)",
                      "Courts have discretion to consider any relevant factor to achieve equity"
                    ],
                    color: "lime"
                  },
                  {
                    section: "Section 12",
                    title: "Division of Matrimonial Property Upon Divorce",
                    content: [
                      "Upon granting a decree of divorce, court shall make orders on division of matrimonial property",
                      "Division must be equitable (fair) considering all circumstances",
                      "Court considers contributions of both parties (monetary and non-monetary)",
                      "Court can order: sale and division of proceeds, transfer to one party with compensation to other, partition, retention by one party",
                      "Orders binding and enforceable like any court judgment"
                    ],
                    color: "green"
                  },
                  {
                    section: "Section 17",
                    title: "Protection of Matrimonial Home",
                    content: [
                      "Neither spouse can sell, transfer, lease, or mortgage the matrimonial home without consent of the other spouse",
                      "Any transaction without consent is voidable at instance of non-consenting spouse",
                      "Protection applies regardless of whose name title is registered in",
                      "During divorce proceedings, court can issue injunctions preventing disposal of matrimonial home",
                      "Protects vulnerable spouses from unilateral asset stripping"
                    ],
                    color: "emerald"
                  },
                  {
                    section: "Section 18",
                    title: "Separate Property",
                    content: [
                      "Property acquired before marriage remains separate property unless converted to matrimonial property",
                      "Gifts and inheritance received by one spouse remain separate unless commingled",
                      "Property acquired after separation is separate property",
                      "Business or professional assets in sole name may be separate depending on contribution analysis",
                      "Burden of proof on party claiming property is separate"
                    ],
                    color: "teal"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-white p-6 rounded-xl shadow-xl border-2 border-${item.color}-300 hover:shadow-2xl transition-all duration-300`}>
                    <h3 className={`text-2xl font-bold text-gray-900 mb-4 flex items-center`}>
                      <Scale className={`w-7 h-7 text-${item.color}-600 mr-3`} />
                      {item.section}: {item.title}
                    </h3>
                    <div className={`bg-${item.color}-50 p-5 rounded-lg space-y-3`}>
                      {item.content.map((text, cidx) => (
                        <div key={cidx} className="flex items-start">
                          <CheckCircle2 className={`w-4 h-4 text-${item.color}-600 mr-2 mt-1 flex-shrink-0`} />
                          <p className="text-gray-700 text-sm">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Children Act 2022 */}
        <section className="mb-16 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-pink-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-pink-600 to-rose-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">Children Act, 2022 (Act No. 29 of 2022 - Revised)</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-pink-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed mb-2">This Act makes provision for parental responsibility, fostering, adoption, custody, maintenance, guardianship, care and protection of children, and for connected purposes. It is the primary legislation governing children's welfare in divorce proceedings.</p>
                <div className="mt-3 bg-pink-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700"><strong>Latest Revision:</strong> 2022 | Revised and consolidated all previous children legislation</p>
                </div>
              </div>

              {/* Key Definitions from Children Act */}
              <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-pink-300 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-7 h-7 text-pink-600 mr-3" />
                  Section 2: Interpretation - Key Definitions from Children Act 2022
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-pink-50 p-5 rounded-lg border-l-4 border-pink-600">
                    <div className="font-bold text-pink-900 mb-3 text-lg">"Child"</div>
                    <p className="text-gray-700 text-sm italic mb-2">"child" means a human being under the age of eighteen years;</p>
                    <div className="bg-white p-4 rounded-lg mt-3">
                      <p className="text-sm text-gray-700"><strong>Legal Significance:</strong> Anyone under 18 is a child and entitled to all protections under the Act. Parental responsibility and maintenance obligations continue until child turns 18 (or longer if child has disability or pursuing full-time education per Section 76).</p>
                    </div>
                  </div>

                  <div className="bg-rose-50 p-5 rounded-lg border-l-4 border-rose-600">
                    <div className="font-bold text-rose-900 mb-3 text-lg">"Best Interests of the Child"</div>
                    <p className="text-gray-700 mb-3">Section 4 defines this paramount principle:</p>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Section 4(1):</strong> "In all actions concerning children...the best interests of the child shall be a primary consideration."</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Section 4(2) - Factors Court Must Consider:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• Child's age, maturity, stage of development, background</li>
                        <li>• Physical and emotional security</li>
                        <li>• Intellectual, emotional, social, cultural development</li>
                        <li>• Any disability or chronic illness</li>
                        <li>• Need to remain with parents/family</li>
                        <li>• Need to maintain connection with culture/tradition</li>
                        <li>• Relationships with parents and significant persons</li>
                        <li>• Parents' attitude and capacity to care for child</li>
                        <li>• Child's views (depending on age/maturity)</li>
                      </ul>
                      <p className="text-sm text-gray-700 mt-3 font-semibold">This principle overrides parents' wishes - court decides based on what's best for child, not what parents want.</p>
                    </div>
                  </div>

                  <div className="bg-red-50 p-5 rounded-lg border-l-4 border-red-600">
                    <div className="font-bold text-red-900 mb-3 text-lg">"Parental Responsibility" (Section 23)</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> All the rights, duties, powers, responsibilities and authority which parents have in relation to their children.</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Includes:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• Duty to maintain child (food, shelter, clothing, education, medical care)</li>
                        <li>• Duty to protect child from harm, abuse, neglect</li>
                        <li>• Right to determine child's education and religion</li>
                        <li>• Right to determine child's name</li>
                        <li>• Duty to provide guidance and discipline</li>
                        <li>• Right to make decisions about child's welfare</li>
                      </ul>
                      <p className="text-sm text-gray-700 mt-3"><strong>Critical:</strong> Divorce does NOT terminate parental responsibility. Both parents retain it unless court orders otherwise.</p>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-5 rounded-lg border-l-4 border-orange-600">
                    <div className="font-bold text-orange-900 mb-3 text-lg">"Custody" (Section 79 context)</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> The right and responsibility to make day-to-day decisions about the child and to have the child reside primarily with you.</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Three Types:</strong></p>
                      <ul className="ml-4 space-y-2 text-sm text-gray-700">
                        <li>• <strong>Sole Custody:</strong> Child lives with one parent who makes all decisions. Other parent has access/visitation rights.</li>
                        <li>• <strong>Joint Custody:</strong> Both parents share decision-making but child primarily resides with one parent.</li>
                        <li>• <strong>Shared Custody:</strong> Child spends substantial time living with both parents (e.g., alternating weeks, months).</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-600">
                    <div className="font-bold text-amber-900 mb-3 text-lg">"Access/Visitation" (Section 79 context)</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition:</strong> The right of the non-custodial parent (or other significant persons) to spend time with the child.</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Types of Access:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• <strong>Reasonable access:</strong> Flexible arrangement agreed by parents</li>
                        <li>• <strong>Specified access:</strong> Court orders specific days/times/duration</li>
                        <li>• <strong>Supervised access:</strong> Visits supervised by third party (if safety concerns)</li>
                        <li>• <strong>No access:</strong> Denied if in child's best interests (rare, extreme cases)</li>
                      </ul>
                      <p className="text-sm text-gray-700 mt-2"><strong>Standard access:</strong> Typically every other weekend, half of school holidays, alternate public holidays, special occasions.</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-600">
                    <div className="font-bold text-blue-900 mb-3 text-lg">"Maintenance" (Section 76)</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Definition (Section 76(2)):</strong> The duty to maintain a child includes providing:</p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• Food and nutrition</li>
                        <li>• Clothing and footwear</li>
                        <li>• Shelter/accommodation</li>
                        <li>• Education (school fees, books, uniforms, transport)</li>
                        <li>• Medical care and health insurance</li>
                        <li>• Recreation and extracurricular activities</li>
                      </ul>
                      <p className="text-sm text-gray-700 mt-3"><strong>Section 76(3):</strong> Both parents are liable to maintain child in proportion to their means. Divorce doesn't end this obligation.</p>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-5 rounded-lg border-l-4 border-indigo-600">
                    <div className="font-bold text-indigo-900 mb-3 text-lg">"Guardian"</div>
                    <p className="text-gray-700 text-sm italic mb-2">"guardian" means a person, other than a parent, who has parental responsibility for a child;</p>
                    <div className="bg-white p-4 rounded-lg mt-3">
                      <p className="text-sm text-gray-700"><strong>Examples:</strong> Grandparent, aunt/uncle, older sibling appointed by court or by parent's will. Guardian has same responsibilities as parent. In divorce cases, parents usually remain guardians unless court appoints someone else due to unfitness.</p>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-600">
                    <div className="font-bold text-purple-900 mb-3 text-lg">"Child's Views" (Section 4(2)(j))</div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2"><strong>Principle:</strong> Court must consider child's views depending on age and maturity.</p>
                      <p className="text-sm text-gray-700 mb-2"><strong>Practice:</strong></p>
                      <ul className="ml-4 space-y-1 text-sm text-gray-700">
                        <li>• Children under 7: Views rarely determinative</li>
                        <li>• Children 7-12: Views considered but not controlling</li>
                        <li>• Children 13-17: Views given significant weight</li>
                        <li>• Child can express preference on custody, living arrangements</li>
                        <li>• Court may interview child in chambers (private)</li>
                        <li>• Child's preference not binding - best interests paramount</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    section: "Section 4",
                    title: "Best Interests of the Child Principle",
                    content: [
                      "Section 4(1): In all actions concerning children, whether undertaken by public or private bodies, the best interests of the child shall be a primary consideration",
                      "Section 4(2): Court must consider: (a) child's age, maturity, stage of development, background and capabilities; (b) child's physical and emotional security and intellectual, emotional, social and cultural development; (c) any disability child may have; (d) any chronic illness child may suffer; (e) need for child to remain in care of parents, extended family; (f) need for child to maintain connection with family, extended family, culture or tradition; (g) child's relationships with parents and other significant persons; (h) attitude of parents towards child; (i) capacity of parents to provide for child's needs; (j) child's views (depending on age and maturity)",
                      "This principle is paramount and overrides parents' preferences in custody decisions"
                    ],
                    color: "pink"
                  },
                  {
                    section: "Section 23",
                    title: "Parental Responsibility",
                    content: [
                      "Section 23(1): Both parents have parental responsibility for their children",
                      "Section 23(2): Parental responsibility includes: duty to maintain, protect, and educate child; right to determine child's education, religion, name; duty to provide guidance and discipline",
                      "Divorce does not terminate parental responsibility",
                      "Both parents retain equal parental responsibility unless court orders otherwise",
                      "Parental responsibility continues until child turns 18 years (or longer if child has disability or is in full-time education)"
                    ],
                    color: "rose"
                  },
                  {
                    section: "Section 24",
                    title: "Joint Parental Responsibility",
                    content: [
                      "Section 24(1): Where parents are married to each other, they have joint parental responsibility",
                      "Section 24(2): Divorce does not extinguish joint parental responsibility",
                      "Both parents must be consulted on major decisions affecting child",
                      "Court encourages shared parenting arrangements after divorce",
                      "Either parent can apply to court if other parent not exercising responsibility properly"
                    ],
                    color: "red"
                  },
                  {
                    section: "Section 76",
                    title: "Duty to Maintain Child",
                    content: [
                      "Section 76(1): Every parent has duty to maintain their child",
                      "Section 76(2): Duty to maintain includes: providing food, clothing, shelter, education, medical care",
                      "Section 76(3): Both parents liable to maintain child in proportion to their means",
                      "Duty continues until child turns 18 or completes education (whichever is later)",
                      "Divorce does not terminate maintenance obligation"
                    ],
                    color: "pink"
                  },
                  {
                    section: "Section 77",
                    title: "Determination of Maintenance Amount",
                    content: [
                      "Court considers: (a) means and needs of child; (b) income, earning capacity, property and financial resources of both parents; (c) financial needs, obligations and responsibilities of each parent; (d) standard of living child enjoyed before parents' separation; (e) age of child; (f) manner in which child was being educated or trained; (g) any special needs of child",
                      "Maintenance covers: school fees, medical expenses, food, clothing, accommodation, extracurricular activities",
                      "Court can order monthly payments, lump sum, or combination",
                      "Maintenance orders reviewable on change of circumstances"
                    ],
                    color: "rose"
                  },
                  {
                    section: "Section 78",
                    title: "Enforcement of Maintenance Orders",
                    content: [
                      "Maintenance orders enforceable like any court judgment",
                      "Defaulting parent can be held in contempt of court",
                      "Court can order: attachment of salary, sale of property, imprisonment (last resort)",
                      "Maintenance arrears accrue as debt and are recoverable",
                      "Parent can apply for variation if circumstances change"
                    ],
                    color: "red"
                  },
                  {
                    section: "Section 79",
                    title: "Custody and Access",
                    content: [
                      "Court can grant: sole custody (one parent), joint custody (both parents share), or shared custody (child lives with both parents)",
                      "Non-custodial parent entitled to reasonable access/visitation",
                      "Access can be supervised if child's safety at risk",
                      "Court can restrict or deny access if in child's best interests",
                      "Access orders specify: frequency, duration, conditions, supervision requirements"
                    ],
                    color: "pink"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-white p-6 rounded-xl shadow-xl border-2 border-${item.color}-300`}>
                    <h3 className={`text-2xl font-bold text-gray-900 mb-4 flex items-center`}>
                      <FileCheck className={`w-7 h-7 text-${item.color}-600 mr-3`} />
                      {item.section}: {item.title}
                    </h3>
                    <div className={`bg-${item.color}-50 p-5 rounded-lg space-y-3`}>
                      {item.content.map((text, cidx) => (
                        <div key={cidx} className="flex items-start">
                          <CheckCircle2 className={`w-4 h-4 text-${item.color}-600 mr-2 mt-1 flex-shrink-0`} />
                          <p className="text-gray-700 text-sm">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Civil Procedure Act & Rules */}
        <section className="mb-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-indigo-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Civil Procedure Act & Rules (Cap. 21, Laws of Kenya)</h2>
              
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-indigo-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed">The Civil Procedure Act and its accompanying Rules govern all civil proceedings in Kenya, including divorce cases. Order XXV specifically deals with matrimonial causes.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-indigo-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Book className="w-7 h-7 text-indigo-600 mr-3" />
                    Order XXV: Matrimonial Causes
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      {
                        rule: "Rule 1",
                        title: "Application of Order",
                        content: "This Order applies to all matrimonial causes including petitions for dissolution, judicial separation, nullity, and restitution of conjugal rights"
                      },
                      {
                        rule: "Rule 2",
                        title: "Form and Contents of Petition",
                        content: "Petition must be in prescribed form, state grounds clearly, provide full particulars, list all children, detail matrimonial property, and state prayers/reliefs sought"
                      },
                      {
                        rule: "Rule 3",
                        title: "Answer to Petition",
                        content: "Respondent must file memorandum of appearance within 15 days of service, then file answer/defense within 21 days. Can consent, defend, or cross-petition"
                      },
                      {
                        rule: "Rule 4",
                        title: "Service of Petition",
                        content: "Petition must be personally served on respondent. If personal service impracticable, court may order substituted service (newspaper publication, posting at residence)"
                      },
                      {
                        rule: "Rule 5",
                        title: "Intervention by Co-Respondent",
                        content: "In adultery cases, alleged adulterer can be joined as co-respondent and may defend or claim costs"
                      },
                      {
                        rule: "Rule 6",
                        title: "Pre-Trial Conference",
                        content: "Court shall hold pre-trial conference to identify issues, promote settlement, exchange evidence, and give directions for trial"
                      },
                      {
                        rule: "Rule 7",
                        title: "Trial and Evidence",
                        content: "Petitioner presents case first. Respondent then presents defense. Both parties can call witnesses. Court can examine witnesses. Standard of proof is balance of probabilities"
                      },
                      {
                        rule: "Rule 8",
                        title: "Decree and Orders",
                        content: "Court pronounces judgment in open court. Decree nisi granted if grounds proven. Final orders made on custody, maintenance, and property"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                        <div className="font-bold text-indigo-900 mb-2">{item.rule}: {item.title}</div>
                        <p className="text-gray-700 text-sm">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-purple-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-7 h-7 text-purple-600 mr-3" />
                    Order V: Service of Summons
                  </h3>
                  <div className="bg-purple-50 p-5 rounded-lg space-y-3">
                    {[
                      "Service must be personal (hand to hand delivery) unless court orders otherwise",
                      "Process server must file affidavit of service proving service was effected",
                      "If respondent evades service, petitioner can apply for substituted service",
                      "Substituted service methods: publication in newspapers, posting at residence, service on advocate",
                      "Service deemed complete when substituted service method complied with"
                    ].map((text, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
            Frequently Asked Questions About Divorce Law in Kenya
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
      <footer className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md inline-block p-3 rounded-full mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <p className="text-base opacity-90 max-w-3xl mx-auto leading-relaxed mb-4">
            This is a legal reference guide based on Kenya's statutes. For specific legal advice, consult a qualified family law advocate.
          </p>
          <p className="text-sm opacity-75">
            Last Updated: February 2026 | All Acts and Articles cited are current as of this date
          </p>
          <p className="text-sm opacity-75 mt-2">
            © {new Date().getFullYear()} Wakili. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DivorceLawKenya;
