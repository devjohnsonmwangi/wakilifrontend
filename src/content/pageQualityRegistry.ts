export type ContentCategory = 'family' | 'land' | 'business' | 'elections' | 'employment' | 'general';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface PageQualityMeta {
  title: string;
  description: string;
  category: ContentCategory;
  datePublished: string;
  dateModified: string;
  authorName: string;
}

export interface RouteDeepContent {
  whoShouldRead: string;
  practicalChecklist: string[];
  commonMistakes: string[];
}

const DEFAULT_AUTHOR = 'Wakili Legal Editorial Team';
const DEFAULT_PUBLISHED = '2026-03-01';
const DEFAULT_MODIFIED = '2026-03-12';

const routeOverrides: Record<string, Partial<PageQualityMeta>> = {
  '/': {
    title: 'Find a Lawyer in Kenya | Wakili',
    description:
      'Connect with verified Kenyan lawyers for family, land, business, election, and employment legal services with clear practical guidance.',
    category: 'general',
  },
  '/howitworks': {
    title: 'How Wakili Works | Legal Services Process in Kenya',
    description:
      'Understand how Wakili connects clients with verified Kenyan advocates, consultation timelines, and legal support workflows.',
    category: 'general',
  },
  '/about': {
    title: 'About Wakili | Kenya Legal Information Platform',
    description:
      'Learn about Wakili’s legal editorial process, quality standards, and mission to make practical legal guidance accessible in Kenya.',
    category: 'general',
  },
  '/updates': {
    title: 'Kenya Legal News and Updates | Wakili',
    description:
      'Follow practical legal updates, procedural changes, and policy developments that affect Kenyan individuals and businesses.',
    category: 'general',
  },
  '/family-law-divorce-kenya': {
    title: 'Family Law and Divorce in Kenya | Wakili',
    description:
      'Practical family law guidance on divorce, children matters, maintenance, and court process in Kenya.',
    category: 'family',
  },
  '/land-disputes-kenya': {
    title: 'Land Disputes in Kenya | Procedure, Evidence and Remedies',
    description:
      'Understand how land disputes are handled in Kenya including title conflicts, boundaries, evidence, and dispute resolution options.',
    category: 'land',
  },
  '/how-to-register-business-kenya': {
    title: 'How to Register a Business in Kenya | Wakili Guide',
    description:
      'Step-by-step business registration guidance in Kenya including name search, entity choices, filings, and compliance.',
    category: 'business',
  },
  '/elections-in-kenya': {
    title: 'Elections in Kenya | Legal Framework and Process',
    description:
      'Understand the election process in Kenya including institutions, voter rights, dispute handling, and legal timelines.',
    category: 'elections',
  },
  '/kenya-employment-labour-laws': {
    title: 'Kenya Employment and Labour Laws | Employee and Employer Guide',
    description:
      'Practical employment law guidance in Kenya on contracts, rights, obligations, disciplinary process, and disputes.',
    category: 'employment',
  },
};

const categoryDescription: Record<ContentCategory, string> = {
  family: 'Practical legal guidance on family law in Kenya, including court procedures, timelines, and required documents.',
  land: 'Practical legal guidance on land law in Kenya, including title verification, transfer procedures, and dispute resolution.',
  business:
    'Practical legal guidance on business law and company compliance in Kenya, including registration, filings, and statutory obligations.',
  elections:
    'Practical legal guidance on election law in Kenya, including rights, timelines, institutions, and dispute resolution process.',
  employment:
    'Practical legal guidance on labour and employment law in Kenya, including contracts, rights, obligations, and remedies.',
  general: 'Practical legal guidance in Kenya with clear explanations, actionable checklists, and references to official institutions.',
};

const categoryFaqs: Record<ContentCategory, FaqItem[]> = {
  family: [
    {
      question: 'Does this page replace advice from a lawyer?',
      answer:
        'No. This guide is educational and helps you prepare, but legal strategy depends on your specific facts and should be reviewed by an advocate.',
    },
    {
      question: 'What documents should I prepare before filing a family case?',
      answer:
        'Commonly used documents include identification, marriage or birth records where relevant, and evidence supporting your claim or response.',
    },
    {
      question: 'How long can a family case take in Kenya?',
      answer:
        'Timelines vary based on complexity, court diary availability, and whether parties settle. Early legal preparation usually improves efficiency.',
    },
  ],
  land: [
    {
      question: 'How can I verify land ownership details in Kenya?',
      answer:
        'Use official land registry and search processes, then confirm survey and planning records before committing to a transaction.',
    },
    {
      question: 'What is the first step when a land dispute starts?',
      answer:
        'Preserve evidence, gather title and transaction documents, and seek legal guidance early before taking irreversible actions.',
    },
    {
      question: 'Can land disputes be resolved without a full trial?',
      answer:
        'Yes. Negotiation, mediation, and properly documented settlement can resolve many disputes depending on the issues involved.',
    },
  ],
  business: [
    {
      question: 'Which business structure should I choose in Kenya?',
      answer:
        'The right structure depends on ownership, risk, funding plans, and tax profile. Compare sole proprietorship, partnerships, and companies before filing.',
    },
    {
      question: 'What causes many registration or filing delays?',
      answer:
        'Frequent issues include incomplete forms, mismatched names, missing supporting documents, and late statutory filings.',
    },
    {
      question: 'Do businesses need ongoing legal compliance after registration?',
      answer:
        'Yes. Most entities have recurring obligations such as annual returns, tax compliance, permits, and record-keeping requirements.',
    },
  ],
  elections: [
    {
      question: 'Where should election complaints be filed in Kenya?',
      answer:
        'The correct forum depends on the issue and stage of the process. Electoral bodies, tribunals, or courts may each have jurisdiction.',
    },
    {
      question: 'Why are election timelines strict?',
      answer:
        'Election disputes are time-sensitive by law, so late filings can be rejected even where the complaint is substantive.',
    },
    {
      question: 'What evidence is useful in election disputes?',
      answer:
        'Reliable documentary records, official forms, witness statements, and properly preserved digital evidence are typically important.',
    },
  ],
  employment: [
    {
      question: 'Can an employee be terminated without procedure in Kenya?',
      answer:
        'Employment disputes often turn on process and fairness. Proper notice, hearing steps, and documented reasons are usually critical.',
    },
    {
      question: 'What should employers document during disciplinary matters?',
      answer:
        'Employers should keep clear records of notices, responses, hearings, and final decisions to reduce legal risk.',
    },
    {
      question: 'What can an employee do after unfair treatment?',
      answer:
        'Employees should preserve records, seek advice early, and use the appropriate internal and legal dispute resolution channels.',
    },
  ],
  general: [
    {
      question: 'How often is Wakili legal content reviewed?',
      answer:
        'Pages are reviewed periodically by the legal editorial team to keep guidance clear, practical, and aligned with current Kenyan practice.',
    },
    {
      question: 'Can I rely on these pages for courtroom representation?',
      answer:
        'No. These pages help with education and preparation, but representation and legal opinions should come from a qualified advocate.',
    },
    {
      question: 'How do I get personalized legal help?',
      answer:
        'Use Wakili contact channels to share your situation and get connected with a verified lawyer for case-specific assistance.',
    },
  ],
};

const categorySources: Record<ContentCategory, SourceLink[]> = {
  family: [
    { label: 'Kenya Law Reports', url: 'https://new.kenyalaw.org/' },
    { label: 'Judiciary of Kenya', url: 'https://judiciary.go.ke/' },
    { label: 'National Council for Law Reporting', url: 'https://kenyalaw.org/' },
  ],
  land: [
    { label: 'Ministry of Lands and Physical Planning', url: 'https://lands.go.ke/' },
    { label: 'ArdhiSasa Platform', url: 'https://ardhisasa.lands.go.ke/' },
    { label: 'Kenya Law Reports', url: 'https://new.kenyalaw.org/' },
  ],
  business: [
    { label: 'eCitizen Business Registration Service', url: 'https://www.ecitizen.go.ke/' },
    { label: 'Kenya Revenue Authority', url: 'https://www.kra.go.ke/' },
    { label: 'Kenya Law Reports', url: 'https://new.kenyalaw.org/' },
  ],
  elections: [
    { label: 'IEBC Official Website', url: 'https://www.iebc.or.ke/' },
    { label: 'Kenya Law Reports', url: 'https://new.kenyalaw.org/' },
    { label: 'Judiciary of Kenya', url: 'https://judiciary.go.ke/' },
  ],
  employment: [
    { label: 'Ministry of Labour and Social Protection', url: 'https://labour.go.ke/' },
    { label: 'Kenya Law Reports', url: 'https://new.kenyalaw.org/' },
    { label: 'Employment and Labour Relations Court', url: 'https://judiciary.go.ke/courts/courts-of-equal-status/' },
  ],
  general: [
    { label: 'Kenya Law Reports', url: 'https://new.kenyalaw.org/' },
    { label: 'Judiciary of Kenya', url: 'https://judiciary.go.ke/' },
    { label: 'Kenya eCitizen Portal', url: 'https://www.ecitizen.go.ke/' },
  ],
};

const routeDeepContent: Record<string, RouteDeepContent> = {
  '/howitworks': {
    whoShouldRead: 'People who want to understand Wakili service flow before booking legal help.',
    practicalChecklist: [
      'Define your legal issue in one clear paragraph.',
      'Collect key documents before first consultation.',
      'Confirm expected timelines and fees in writing.',
      'Track action items after every lawyer interaction.',
    ],
    commonMistakes: [
      'Starting consultations without supporting documents.',
      'Assuming all legal matters follow the same timeline.',
      'Delaying follow-up after receiving legal instructions.',
    ],
  },
  '/services': {
    whoShouldRead: 'Clients comparing legal service options before engaging an advocate.',
    practicalChecklist: [
      'Match your issue to the correct service category.',
      'Ask which deliverables are included in the quoted fee.',
      'Confirm whether court appearances are covered.',
      'Request expected milestones and reporting format.',
    ],
    commonMistakes: [
      'Choosing a service based only on initial cost.',
      'Skipping scope confirmation before payment.',
      'Not clarifying documents the lawyer needs from you.',
    ],
  },
  '/about': {
    whoShouldRead: 'Users evaluating content trust and legal editorial standards.',
    practicalChecklist: [
      'Review page update dates before relying on guidance.',
      'Cross-check official source links provided on each page.',
      'Use contact channels for case-specific legal advice.',
    ],
    commonMistakes: [
      'Treating general guides as case-specific legal opinions.',
      'Ignoring jurisdiction-specific requirements in Kenya.',
      'Relying on outdated legal information from other sources.',
    ],
  },
  '/updates': {
    whoShouldRead: 'Readers who need legal developments that may affect ongoing matters.',
    practicalChecklist: [
      'Check publication and update dates on each update.',
      'Compare changes against your current legal process.',
      'Consult a lawyer where new rules affect your deadlines.',
    ],
    commonMistakes: [
      'Applying old procedures after regulatory changes.',
      'Assuming policy updates apply retrospectively in all cases.',
      'Ignoring transition periods in legal changes.',
    ],
  },
  '/family-law-divorce-kenya': {
    whoShouldRead: 'Spouses and families preparing for divorce, custody, or maintenance proceedings.',
    practicalChecklist: [
      'Gather marriage, identity, and children-related records.',
      'Document financial contributions and household responsibilities.',
      'List urgent interim orders you may need from court.',
      'Plan child welfare arrangements before filing.',
    ],
    commonMistakes: [
      'Filing without complete supporting documentation.',
      'Escalating conflict instead of preserving evidence.',
      'Ignoring temporary relief options during case pendency.',
    ],
  },
  '/divorce-in-kenya': {
    whoShouldRead: 'Individuals planning to start or respond to divorce proceedings in Kenya.',
    practicalChecklist: [
      'Confirm the legal ground relied upon in your petition.',
      'Prepare chronology of events and supporting proof.',
      'Assess property and maintenance issues early.',
      'Set expectations on timelines and possible settlement routes.',
    ],
    commonMistakes: [
      'Relying on oral claims without documentary proof.',
      'Mixing emotional issues with legal pleadings.',
      'Failing to prepare for service and response timelines.',
    ],
  },
  '/child-law-kenya': {
    whoShouldRead: 'Parents and guardians handling custody, maintenance, or child protection matters.',
    practicalChecklist: [
      'Prioritize the best interests of the child in every step.',
      'Keep school, medical, and caregiving records organized.',
      'Document maintenance payments and unmet obligations.',
      'Prepare a practical parenting schedule proposal.',
    ],
    commonMistakes: [
      'Using children as leverage in disputes.',
      'Failing to document childcare expenses and support.',
      'Ignoring enforceability of informal custody arrangements.',
    ],
  },
  '/succession-inheritance-law-kenya': {
    whoShouldRead: 'Families managing inheritance, estate administration, and beneficiary rights.',
    practicalChecklist: [
      'Identify all beneficiaries and estate assets comprehensively.',
      'Confirm whether a valid will exists and where it is held.',
      'Collect death certificate and property ownership records.',
      'Track deadlines for petitions, gazettement, and confirmations.',
    ],
    commonMistakes: [
      'Distributing assets before lawful grant confirmation.',
      'Excluding potential beneficiaries without legal basis.',
      'Overlooking debts and liabilities of the estate.',
    ],
  },
  '/land-disputes-kenya': {
    whoShouldRead: 'Land owners, buyers, or occupants facing ownership or boundary conflicts.',
    practicalChecklist: [
      'Secure title records, agreements, and search results.',
      'Preserve site evidence including boundaries and occupation history.',
      'Map dispute facts in a clear timeline.',
      'Explore mediation options before full litigation where suitable.',
    ],
    commonMistakes: [
      'Attempting self-help actions that worsen legal exposure.',
      'Failing to preserve documentary and survey evidence early.',
      'Ignoring jurisdiction requirements for the chosen forum.',
    ],
  },
  '/land-ownership-title-deed-verification-kenya': {
    whoShouldRead: 'Buyers and owners who need to verify title authenticity before transactions.',
    practicalChecklist: [
      'Run official land search before paying deposit funds.',
      'Verify seller identity and authority to transfer.',
      'Confirm survey, zoning, and planning status.',
      'Keep all transaction documents signed and traceable.',
    ],
    commonMistakes: [
      'Relying on photocopies without official verification.',
      'Paying full purchase price before due diligence completion.',
      'Skipping professional review of sale agreements.',
    ],
  },
  '/how-to-buy-land-safely-kenya': {
    whoShouldRead: 'First-time and repeat buyers seeking safer land acquisition process in Kenya.',
    practicalChecklist: [
      'Conduct legal and survey due diligence before commitment.',
      'Use written agreements reviewed by a legal professional.',
      'Pay through traceable channels tied to contractual milestones.',
      'Complete transfer registration promptly after completion.',
    ],
    commonMistakes: [
      'Trusting verbal assurances instead of verified records.',
      'Skipping site visit and occupancy checks.',
      'Ignoring potential encumbrances and restrictions on title.',
    ],
  },
  '/how-to-register-business-kenya': {
    whoShouldRead: 'Entrepreneurs starting formal businesses and choosing legal structures in Kenya.',
    practicalChecklist: [
      'Select structure aligned with liability and growth goals.',
      'Reserve and verify your business or company name.',
      'Prepare director/owner information accurately before filing.',
      'Set post-registration compliance calendar immediately.',
    ],
    commonMistakes: [
      'Registering without understanding tax and compliance duties.',
      'Using inconsistent names across supporting documents.',
      'Delaying statutory updates after registration.',
    ],
  },
  '/business-name-search-kenya': {
    whoShouldRead: 'Founders conducting pre-registration checks to avoid name rejection delays.',
    practicalChecklist: [
      'Prepare multiple name alternatives before submission.',
      'Avoid restricted, misleading, or duplicate naming patterns.',
      'Ensure spelling consistency with intended branding.',
      'Keep reservation timelines in your registration schedule.',
    ],
    commonMistakes: [
      'Submitting only one preferred name option.',
      'Ignoring naming restrictions set by regulators.',
      'Allowing name reservation to lapse before registration.',
    ],
  },
  '/limited-company-registration-kenya': {
    whoShouldRead: 'Businesses formalizing operations through limited company structures.',
    practicalChecklist: [
      'Define shareholding and director roles before filing.',
      'Prepare constitutional and compliance documents accurately.',
      'Set up statutory registers and corporate records early.',
      'Plan annual returns and tax filing schedule from day one.',
    ],
    commonMistakes: [
      'Unclear shareholding arrangements among founders.',
      'Failing to maintain corporate records after incorporation.',
      'Missing annual filing obligations in early years.',
    ],
  },
  '/business-tax-obligations-kenya': {
    whoShouldRead: 'Business owners managing recurring tax and statutory obligations in Kenya.',
    practicalChecklist: [
      'Identify all applicable taxes for your entity and sector.',
      'Create monthly and annual compliance calendar reminders.',
      'Maintain transaction records in an audit-ready format.',
      'Review filings periodically with a qualified professional.',
    ],
    commonMistakes: [
      'Assuming one tax registration covers all obligations.',
      'Poor bookkeeping leading to filing and penalty risk.',
      'Late returns due to absent compliance workflows.',
    ],
  },
  '/elections-in-kenya': {
    whoShouldRead: 'Citizens, candidates, and observers seeking election process clarity in Kenya.',
    practicalChecklist: [
      'Confirm applicable election timelines and procedural stages.',
      'Use official IEBC communication channels for updates.',
      'Document incidents with dates, places, and supporting proof.',
      'Escalate disputes to the correct forum within legal timelines.',
    ],
    commonMistakes: [
      'Filing complaints in the wrong forum or too late.',
      'Relying on unverified social media claims as evidence.',
      'Ignoring statutory dispute resolution deadlines.',
    ],
  },
  '/how-to-register-as-a-voter-kenya': {
    whoShouldRead: 'Eligible citizens preparing for voter registration and verification.',
    practicalChecklist: [
      'Confirm eligibility and required registration documents.',
      'Verify details after registration to catch errors early.',
      'Track voter transfer and update windows where relevant.',
      'Retain acknowledgment details for future verification.',
    ],
    commonMistakes: [
      'Waiting until late windows to attempt registration.',
      'Not checking registered station details after enrollment.',
      'Using incomplete identification information.',
    ],
  },
  '/election-results-declaration-kenya': {
    whoShouldRead: 'Stakeholders monitoring result declaration and legal challenge timelines.',
    practicalChecklist: [
      'Track official declaration forms and publication points.',
      'Record discrepancies immediately with specific references.',
      'Map challenge timelines from declaration date and time.',
      'Preserve evidence chain for any petition process.',
    ],
    commonMistakes: [
      'Missing strict deadlines for contesting results.',
      'Submitting generalized complaints without precise records.',
      'Failing to authenticate documentary evidence.',
    ],
  },
  '/kenya-employment-labour-laws': {
    whoShouldRead: 'Employees and employers handling workplace rights and obligations in Kenya.',
    practicalChecklist: [
      'Review contract terms against current workplace practice.',
      'Keep records of notices, warnings, and disciplinary meetings.',
      'Document payroll, leave, and benefit compliance status.',
      'Address disputes early through structured internal process.',
    ],
    commonMistakes: [
      'Treating verbal arrangements as legally sufficient records.',
      'Skipping procedural fairness in disciplinary actions.',
      'Ignoring statutory timelines during dispute escalation.',
    ],
  },
  '/termination-redundancy-severance-kenya': {
    whoShouldRead: 'Employers and employees facing separation, redundancy, or severance decisions.',
    practicalChecklist: [
      'Confirm legal basis for termination or redundancy process.',
      'Issue required notices and conduct procedural hearings.',
      'Calculate dues and severance transparently with records.',
      'Provide final documentation and payment confirmations.',
    ],
    commonMistakes: [
      'Terminating without complete procedural documentation.',
      'Miscalculating final dues and statutory payments.',
      'Failing to communicate reasons and process clearly.',
    ],
  },
};

const getCategoryFromPath = (pathname: string): ContentCategory => {
  if (/divorce|family|child|succession|probate|will/i.test(pathname)) return 'family';
  if (/land|title|leasehold|freehold|survey|zoning|rates|property/i.test(pathname)) return 'land';
  if (/business|company|kra|registration|llp|sole|cr12|permit|tax/i.test(pathname)) return 'business';
  if (/election|voter|iebc|political-parties|candidate|offences/i.test(pathname)) return 'elections';
  if (/employment|labour|redundancy|severance|occupational/i.test(pathname)) return 'employment';
  return 'general';
};

const toReadableTitle = (pathname: string): string => {
  if (pathname === '/') return 'Find a Lawyer in Kenya';
  const slug = pathname.replace(/^\//, '').replace(/-/g, ' ').trim();
  if (!slug) return 'Legal Services Kenya';
  return slug
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getPageQualityMeta = (pathname: string): PageQualityMeta => {
  const override = routeOverrides[pathname] ?? {};
  const category = override.category ?? getCategoryFromPath(pathname);

  return {
    title: override.title ?? `${toReadableTitle(pathname)} | Wakili`,
    description: override.description ?? categoryDescription[category],
    category,
    datePublished: override.datePublished ?? DEFAULT_PUBLISHED,
    dateModified: override.dateModified ?? DEFAULT_MODIFIED,
    authorName: override.authorName ?? DEFAULT_AUTHOR,
  };
};

export const getCategoryFaqs = (category: ContentCategory): FaqItem[] => categoryFaqs[category];

export const getCategorySources = (category: ContentCategory): SourceLink[] => categorySources[category];

export const getRouteDeepContent = (pathname: string): RouteDeepContent | null => routeDeepContent[pathname] ?? null;
