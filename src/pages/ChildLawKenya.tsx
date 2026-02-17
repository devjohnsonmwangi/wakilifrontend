import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Scale,
  BookOpen,
  FileText,
  Shield,
  Gavel,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Heart,
  Users,
  AlertCircle,
  Landmark,
  Book,
  Baby,
  School,
  BadgeCheck,
  MessageCircle,
  Mail
} from 'lucide-react';

const ChildLawKenya = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.title = 'Child Law in Kenya 2026 Children Act 2022, Constitution, Rights, Protection & Procedures';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Complete guide to child law in Kenya: Children Act 2022, Constitution Article 53, parental responsibility, custody, maintenance, adoption, child protection, education, health, and juvenile justice. Updated 2026.'
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
      'child law Kenya, Children Act 2022, child rights Kenya, custody Kenya, child maintenance Kenya, adoption Kenya, parental responsibility Kenya, Article 53 Constitution Kenya, child protection Kenya, juvenile justice Kenya'
    );

    window.scrollTo(0, 0);
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is the main law governing children in Kenya? ',
      answer:
        'The Children Act, 2022 (Act No. 29 of 2022) is the primary law governing children in Kenya. It consolidates all child-related laws and sets out children’s rights, parental responsibility, custody, maintenance, adoption, child protection, and juvenile justice.'
    },
    {
      question: 'What does the Constitution say about children’s rights?',
      answer:
        'Article 53 of the Constitution of Kenya 2010 guarantees every child the right to a name and nationality, free and compulsory basic education, basic nutrition, shelter and health care, protection from abuse and violence, parental care by both parents, and that their best interests are of paramount importance in every matter concerning them.'
    },
    {
      question: 'What is the best interests of the child principle?',
      answer:
        'Section 4 of the Children Act 2022 requires courts and all decision-makers to treat the best interests of the child as the primary consideration in every matter affecting a child. It guides custody, maintenance, adoption, and protection decisions.'
    },
    {
      question: 'How is child custody determined in Kenya?',
      answer:
        'Custody is determined under the Children Act 2022 with the best interests of the child as the guiding principle. Courts consider the child’s age, needs, relationship with each parent, stability, safety, and the ability of each parent to care for the child. Custody can be sole, joint, or shared.'
    },
    {
      question: 'Who is responsible for child maintenance?',
      answer:
        'Both parents are responsible for child maintenance under Section 76 of the Children Act 2022. Maintenance includes food, clothing, shelter, education, and healthcare. Each parent contributes according to their means.'
    },
    {
      question: 'Is child adoption regulated in Kenya?',
      answer:
        'Yes. The Children Act 2022 provides detailed rules on adoption, including eligibility, consent, suitability assessments, and court approval. Adoption orders are issued by the High Court and must prioritize the child’s best interests.'
    }
  ];

  const relatedLaws = [
    {
      title: 'Basic Education Act, 2013',
      icon: <School className="w-6 h-6" />,
      points: [
        'Guarantees free and compulsory basic education.',
        'Prohibits exclusion of children from school due to inability to pay.',
        'Requires parents/guardians to ensure school attendance.'
      ],
      details: 'Establishes the right to access basic education and places a duty on the State, parents, and school boards to ensure enrollment, retention, and protection of learners. School discipline must respect children’s dignity and rights.'
    },
    {
      title: 'Sexual Offences Act, 2006',
      icon: <AlertCircle className="w-6 h-6" />,
      points: [
        'Criminalizes defilement (sexual acts with children).',
        'Provides strict penalties based on child’s age.',
        'Protects children from sexual exploitation and abuse.'
      ],
      details: 'Defines defilement, sexual assault, child trafficking for sexual exploitation, and related offences. Provides mandatory penalties and requires child-friendly court procedures when children are victims or witnesses.'
    },
    {
      title: 'Prohibition of Female Genital Mutilation Act, 2011',
      icon: <Shield className="w-6 h-6" />,
      points: [
        'Criminalizes FGM and related harmful practices.',
        'Protects girls from cultural practices that harm health and dignity.',
        'Provides penalties for parents/guardians who facilitate FGM.'
      ],
      details: 'Creates offences for performing, procuring, or aiding FGM, including for minors. Enables protection orders and reporting mechanisms to prevent FGM on children.'
    },
    {
      title: 'Counter-Trafficking in Persons Act, 2010',
      icon: <Shield className="w-6 h-6" />,
      points: [
        'Criminalizes trafficking in persons, including children.',
        'Provides protections and rehabilitation for child victims.',
        'Enables investigations and prosecutions for child trafficking.'
      ],
      details: 'Recognizes trafficking for labor, sexual exploitation, servitude, or removal of organs. Prioritizes rescue, safe shelter, and reintegration for child victims.'
    },
    {
      title: 'Penal Code (Cap. 63)',
      icon: <Gavel className="w-6 h-6" />,
      points: [
        'Offences against children: neglect, abandonment, trafficking.',
        'Criminal liability for child abuse and child labour abuses.'
      ],
      details: 'Contains general criminal offences applicable to children as victims or offenders, and complements specific child-protection statutes.'
    },
    {
      title: 'Data Protection Act, 2019',
      icon: <Shield className="w-6 h-6" />,
      points: [
        'Recognizes children as vulnerable data subjects.',
        'Requires lawful basis and safeguards for processing children’s data.',
        'Protects children’s privacy in schools, health and online platforms.'
      ],
      details: 'Requires data controllers to implement age-appropriate privacy measures, minimize data collection, and prevent exploitation or profiling of children online.'
    },
    {
      title: 'Employment Act, 2007',
      icon: <BadgeCheck className="w-6 h-6" />,
      points: [
        'Prohibits child labour under 13 years.',
        'Regulates light work for children 13-16 with strict conditions.',
        'Protects children from hazardous work.'
      ],
      details: 'Sets limits on working hours, conditions, and safety for minors and criminalizes exploitative child labor.'
    },
    {
      title: 'Births & Deaths Registration Act (Cap. 149)',
      icon: <FileText className="w-6 h-6" />,
      points: [
        'Requires registration of births for legal identity and nationality.',
        'Birth certificate necessary for school, healthcare, and legal services.'
      ],
      details: 'Registration creates a legal record of identity and age, which is essential for school enrollment, healthcare access, and legal protection.'
    },
    {
      title: 'Refugees Act, 2021',
      icon: <Users className="w-6 h-6" />,
      points: [
        'Protects refugee and asylum-seeking children.',
        'Guarantees access to education, healthcare, and protection services.',
        'Provides safeguards for unaccompanied and separated children.'
      ],
      details: 'Recognizes specific vulnerabilities of refugee children and requires child-protection measures in camps and host communities.'
    },
    {
      title: 'Protection Against Domestic Violence Act, 2015',
      icon: <Heart className="w-6 h-6" />,
      points: [
        'Protects children from domestic violence in the home.',
        'Allows courts to issue protection orders for children.'
      ],
      details: 'Provides emergency, interim, and full protection orders, and empowers police to act swiftly to safeguard children at risk.'
    },
    {
      title: 'Persons with Disabilities Act, 2003',
      icon: <Users className="w-6 h-6" />,
      points: [
        'Protects rights of children with disabilities.',
        'Requires inclusive education and access to services.'
      ],
      details: 'Mandates reasonable accommodation in education, healthcare, and public services to ensure equal opportunities for children with disabilities.'
    },
    {
      title: 'Victim Protection Act, 2014',
      icon: <Shield className="w-6 h-6" />,
      points: [
        'Provides support and protection for child victims of crime.',
        'Ensures access to compensation and safe shelters.'
      ],
      details: 'Ensures child victims and witnesses receive psychosocial support, privacy safeguards, and protection from intimidation during proceedings.'
    }
  ];

  const procedureBlocks = [
    {
      title: 'Children’s Court Jurisdiction',
      items: [
        'Children’s Court established under the Children Act 2022.',
        'Handles custody, maintenance, protection, adoption, and child justice matters.',
        'Orders are enforceable like High Court orders.'
      ]
    },
    {
      title: 'Maintenance Enforcement',
      items: [
        'Maintenance orders can be enforced by attachment of salary or property.',
        'Defaulting parent may be held in contempt of court.',
        'Arrears recoverable as a civil debt.'
      ]
    },
    {
      title: 'Protection Orders & Emergency Care',
      items: [
        'Courts can issue protection orders for children in danger.',
        'Emergency care and rescue orders available for abused or neglected children.',
        'Children’s Officers and police enforce protection orders.'
      ]
    },
    {
      title: 'Adoption Procedure Summary',
      items: [
        'Child must be declared free for adoption by an accredited adoption society.',
        'Prospective parents undergo assessment and home study.',
        'Court issues adoption order based on best interests of child.'
      ]
    },
    {
      title: 'Adoption Eligibility & Requirements (Key Highlights)',
      items: [
        'Applicant must be an adult of sound mind and generally at least 25 years old (subject to court assessment).',
        'Minimum age difference typically 21 years between adopter and child, unless special circumstances apply.',
        'Applicants must be fit and proper, with stable income and suitable living conditions.',
        'Single applicants may adopt, but court scrutinizes best interests and stability.',
        'Consent required from biological parents/guardians unless waived by court (abandonment, untraceable, or unfit).',
        'Mandatory social inquiry report by Children’s Officer/Adoption Society.',
        'Child must have been in continuous care of applicant for required period before final order (as prescribed).'
      ]
    },
    {
      title: 'Child Justice: When a Child May Be Found Guilty',
      items: [
        'Children in conflict with the law may be found responsible for offences such as theft, assault, property damage, robbery, or sexual offences (where age thresholds and criminal responsibility standards are met).',
        'The child justice system prioritizes diversion, rehabilitation, and reintegration over punishment.',
        'Detention is a last resort and for the shortest appropriate period.'
      ]
    },
    {
      title: 'Child Justice Court Procedures (Overview)',
      items: [
        'Arrest must be lawful and child-friendly; parents/guardians and Children’s Officer should be informed promptly.',
        'Child is to be held separately from adults and brought to court quickly.',
        'Court considers diversion options first (counseling, community service, supervision).',
        'If trial proceeds: child gets legal representation, child-friendly hearings, and privacy safeguards.',
        'Sentencing emphasizes rehabilitation (probation, community service, supervision orders).'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
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
              <Link to="/family-law-divorce-kenya" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                Family Law
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">Child Law & Children Act</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white py-12 sm:py-20 px-3 sm:px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 px-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center mb-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mr-4 shadow-xl">
              <Baby className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
                Child Law in Kenya 2026
              </h1>
              <p className="text-lg md:text-xl opacity-90 mt-2">Children Act 2022 | Rights, Protection & Procedures</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl opacity-95 max-w-4xl leading-relaxed mb-6">
            Comprehensive guide to children's rights, parental responsibility, custody, maintenance, adoption, protection, education, health, and juvenile justice in Kenya. <span className="font-semibold text-yellow-300">Updated 2026.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/254112810203?text=${encodeURIComponent('Hello! I need guidance on child law in Kenya. Please advise on custody, maintenance, and child protection services.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Request guidance on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Guidance
            </a>
            <a
              href={`mailto:johnsonthuraniramwangi@gmail.com?subject=${encodeURIComponent('Child Law Legal Services Request')}&body=${encodeURIComponent('Hello, I need guidance on child law in Kenya. My concerns are:\\n\\n')}`}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg border border-white/30 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              aria-label="Request guidance by email"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              Email Services
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="content-full-width">
        <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-8 sm:py-12">
        {/* Section 1: Constitution of Kenya 2010 */}
        <section className="mb-16 bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <Landmark className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Constitution of Kenya, 2010 (Children’s Rights)</h2>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Book className="w-6 h-6 text-blue-600 mr-2" />
                  Article 53: Children
                </h3>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-bold text-blue-900 mb-2">Article 53(1)</div>
                    <ul className="ml-5 space-y-2 text-gray-700 text-sm list-disc">
                      <li>Right to a name and nationality from birth</li>
                      <li>Right to free and compulsory basic education</li>
                      <li>Right to basic nutrition, shelter and health care</li>
                      <li>Right to protection from abuse, neglect, harmful cultural practices, all forms of violence, inhuman treatment, and hazardous or exploitative labour</li>
                      <li>Right to parental care and protection, including equal responsibility of mother and father whether married or not</li>
                      <li>Right not to be detained except as a measure of last resort, and if detained, to be held separately from adults</li>
                    </ul>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-400">
                    <div className="font-bold text-indigo-900 mb-2">Article 53(2)</div>
                    <p className="text-gray-700 italic">"A child’s best interests are of paramount importance in every matter concerning the child."</p>
                  </div>

                  <div className="bg-white p-3 rounded border-l-4 border-blue-500 mt-3">
                    <p className="text-sm text-gray-700"><strong>Legal Effect:</strong> Courts, schools, hospitals, and public agencies must prioritize child welfare in every decision.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Children Act 2022 */}
        <section className="mb-16 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-pink-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-pink-600 to-rose-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-6">Children Act, 2022 (Act No. 29 of 2022)</h2>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6 border-l-4 border-pink-600">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Scope & Purpose</h3>
                <p className="text-gray-700 leading-relaxed">This Act consolidates all child-related laws in Kenya and governs parental responsibility, custody, maintenance, adoption, child protection, foster care, and juvenile justice.</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    section: 'Section 2',
                    title: 'Interpretation - Definition of “Child”',
                    color: 'pink',
                    items: [
                      '“Child” means a human being under the age of eighteen years.',
                      'All protections and rights apply to any person below 18.'
                    ]
                  },
                  {
                    section: 'Section 4',
                    title: 'Best Interests of the Child',
                    color: 'rose',
                    items: [
                      'Best interests are the primary consideration in all actions concerning children.',
                      'Court must consider age, maturity, needs, safety, relationships, stability, and child’s views.'
                    ]
                  },
                  {
                    section: 'Section 23-24',
                    title: 'Parental Responsibility',
                    color: 'red',
                    items: [
                      'Both parents have parental responsibility whether married or not.',
                      'Parental responsibility includes duty to maintain, protect, educate, and guide the child.',
                      'Divorce does not terminate parental responsibility.'
                    ]
                  },
                  {
                    section: 'Section 76-79',
                    title: 'Maintenance, Custody & Access',
                    color: 'pink',
                    items: [
                      'Both parents must maintain child in proportion to their means.',
                      'Maintenance covers food, shelter, education, clothing, and healthcare.',
                      'Custody can be sole, joint, or shared; access rights must be respected.'
                    ]
                  },
                  {
                    section: 'Section 185-190',
                    title: 'Child Protection & Care',
                    color: 'rose',
                    items: [
                      'Protects children from abuse, neglect, exploitation and harmful practices.',
                      'Provides for rescue, emergency protection, and alternative care mechanisms.'
                    ]
                  },
                  {
                    section: 'Part XVII',
                    title: 'Adoption',
                    color: 'red',
                    items: [
                      'Adoption only by court order, based on best interests of the child.',
                      'Requires consent, social inquiry reports, and suitability assessment.'
                    ]
                  },
                  {
                    section: 'Part XV',
                    title: 'Child Justice System (Juvenile Justice)',
                    color: 'pink',
                    items: [
                      'Provides child-friendly procedures for children in conflict with the law.',
                      'Detention is a last resort; diversion and rehabilitation prioritized.',
                      'Children must be held separately from adults and have legal representation.'
                    ]
                  }
                ].map((item, idx) => {
                  const colorClasses = {
                    pink: { border: 'border-pink-300', text: 'text-pink-600', bg: 'bg-pink-50' },
                    rose: { border: 'border-rose-300', text: 'text-rose-600', bg: 'bg-rose-50' },
                    red: { border: 'border-red-300', text: 'text-red-600', bg: 'bg-red-50' }
                  };
                  const colors = colorClasses[item.color as keyof typeof colorClasses];
                  
                  return (
                    <div key={idx} className={`bg-white p-6 rounded-xl shadow-xl border-2 ${colors.border}`}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Scale className={`w-7 h-7 ${colors.text} mr-3`} />
                        {item.section}: {item.title}
                      </h3>
                      <div className={`${colors.bg} p-5 rounded-lg space-y-3`}>
                        {item.items.map((text, cidx) => (
                          <div key={cidx} className="flex items-start">
                            <CheckCircle2 className={`w-4 h-4 ${colors.text} mr-2 mt-1 flex-shrink-0`} />
                            <p className="text-gray-700 text-sm">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Related Child Protection Laws */}
        <section className="mb-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">Other Key Laws Protecting Children in Kenya</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {relatedLaws.map((law, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-2 border-emerald-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <div className="bg-emerald-100 p-3 rounded-lg mr-3">
                        {law.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{law.title}</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {law.points.map((p, pidx) => (
                        <li key={pidx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    {law.details && (
                      <div className="mt-4 bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                        <p className="text-sm text-gray-700">{law.details}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Procedures & Enforcement */}
        <section className="mb-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl shadow-xl p-8 md:p-10 hover:shadow-2xl transition-all duration-300 border-2 border-indigo-200">
          <div className="flex items-start mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-4 rounded-xl mr-4 mt-1 shadow-xl">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6">Procedures, Courts & Enforcement</h2>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <Scale className="w-6 h-6 text-indigo-600 mr-2" />
                    Jurisdictions & Institutions
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />Children’s Court: Primary forum for custody, maintenance, child protection, foster care, and adoption matters under the Children Act 2022.</li>
                    <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />High Court (Family Division): Handles complex child matters, appeals from Children’s Court, and constitutional questions affecting children’s rights.</li>
                    <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />Magistrates’ Courts: May exercise jurisdiction in children matters as provided by the Children Act and court station designation.</li>
                    <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />Office of the Director of Children’s Services: Provides child protection, social inquiry reports, and monitoring of child welfare orders.</li>
                    <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />Adoption Societies (accredited): Declare children free for adoption and conduct assessments.</li>
                    <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />National Council for Children’s Services (NCCS): Policy oversight and coordination of child protection systems.</li>
                  </ul>
                </div>
                {procedureBlocks.map((block, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-2 border-indigo-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <CheckCircle2 className="w-6 h-6 text-indigo-600 mr-2" />
                      {block.title}
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {block.items.map((item, iidx) => (
                        <li key={iidx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
            Frequently Asked Questions About Child Law in Kenya
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
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-emerald-900 to-teal-900 text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md inline-block p-3 rounded-full mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <p className="text-base opacity-90 max-w-3xl mx-auto leading-relaxed mb-4">
            This is a general legal information guide about child law in Kenya and does not constitute legal advice. For specific cases, consult a qualified advocate or Children’s Officer.
          </p>
          <p className="text-sm opacity-75">Last Updated: February 2026 | Based on Constitution of Kenya 2010 and Children Act 2022</p>
          <p className="text-sm opacity-75 mt-2">© {new Date().getFullYear()} Wakili. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ChildLawKenya;
