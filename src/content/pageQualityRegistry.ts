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

export interface ContextualLink {
  to: string;
  label: string;
}

export interface EditorialProfile {
  name: string;
  role: string;
  experience: string;
  focusAreas: string[];
}

export interface EditorialTeamInfo {
  author: EditorialProfile;
  reviewer: EditorialProfile;
}

export interface EvidenceNote {
  claim: string;
  verificationTip: string;
  sourceLabel: string;
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
  '/divorce-law-in-kenya': {
    whoShouldRead: 'Readers who need legal grounds and procedural expectations for divorce matters in Kenya.',
    practicalChecklist: [
      'Confirm applicable legal ground and supporting facts.',
      'Organize communication and evidence records chronologically.',
      'Identify child, maintenance, and property issues in advance.',
      'Review procedural timelines with a legal professional.',
    ],
    commonMistakes: [
      'Basing pleadings on allegations without proof.',
      'Ignoring interim applications where urgent relief is needed.',
      'Missing procedural deadlines for responses and filings.',
    ],
  },
  '/letters-of-administration-probate-kenya': {
    whoShouldRead: 'Families applying for grants and handling estate administration lawfully.',
    practicalChecklist: [
      'List beneficiaries and estate assets with supporting documents.',
      'Prepare petition documents and mandatory notices accurately.',
      'Track gazette and objection timelines.',
      'Document all administrator actions for transparency.',
    ],
    commonMistakes: [
      'Proceeding with distribution before grant confirmation.',
      'Leaving out beneficiaries or material assets.',
      'Failing to keep records of estate transactions.',
    ],
  },
  '/land-transfer-after-death': {
    whoShouldRead: 'Families and buyers involved in post-death land transfer procedures.',
    practicalChecklist: [
      'Confirm lawful administrator authority before transfer.',
      'Verify title and succession documents are consistent.',
      'Prepare transfer instruments with proper execution.',
      'Complete registration and retain stamped records.',
    ],
    commonMistakes: [
      'Attempting transfer without succession compliance.',
      'Using incomplete transfer forms.',
      'Ignoring encumbrances on the property title.',
    ],
  },
  '/land-transfer-process-kenya': {
    whoShouldRead: 'Buyers and sellers managing legal transfer completion steps in Kenya.',
    practicalChecklist: [
      'Verify title, encumbrances, and ownership before signing.',
      'Use a complete sale agreement with clear conditions.',
      'Ensure taxes, fees, and consents are properly handled.',
      'Register transfer promptly after completion.',
    ],
    commonMistakes: [
      'Skipping due diligence to move quickly.',
      'Making final payment before completion conditions are met.',
      'Failing to record all transfer-related payments and receipts.',
    ],
  },
  '/adverse-possession-kenya': {
    whoShouldRead: 'Occupants and owners assessing long-term occupation claims in Kenya.',
    practicalChecklist: [
      'Document possession history and continuity clearly.',
      'Gather supporting witness and boundary evidence.',
      'Assess interruption events that may affect claim strength.',
      'Obtain legal review before commencing court process.',
    ],
    commonMistakes: [
      'Assuming time period alone guarantees success.',
      'Ignoring evidence of consent or permission.',
      'Filing without clear possession chronology.',
    ],
  },
  '/leasehold-freehold-kenya': {
    whoShouldRead: 'Property buyers comparing tenure rights and obligations in Kenya.',
    practicalChecklist: [
      'Confirm tenure type and remaining lease term.',
      'Check renewal, user, and consent conditions on title.',
      'Assess long-term implications for financing and resale.',
      'Verify compliance requirements for land use changes.',
    ],
    commonMistakes: [
      'Ignoring short lease balance during purchase.',
      'Assuming freehold and leasehold rights are identical.',
      'Overlooking title conditions affecting development plans.',
    ],
  },
  '/lost-title-deed-replacement-kenya': {
    whoShouldRead: 'Owners replacing missing or lost title documents in Kenya.',
    practicalChecklist: [
      'Report loss through required legal and administrative channels.',
      'Prepare affidavits and supporting ownership documents.',
      'Follow publication and objection procedures where required.',
      'Track issuance process until replacement is complete.',
    ],
    commonMistakes: [
      'Skipping formal loss reporting steps.',
      'Submitting replacement request with incomplete records.',
      'Ignoring waiting periods in replacement workflow.',
    ],
  },
  '/types-of-elections-kenya': {
    whoShouldRead: 'Citizens and stakeholders comparing legal features of Kenyan election types.',
    practicalChecklist: [
      'Identify office-specific rules and qualification thresholds.',
      'Review nomination, campaign, and dispute timelines.',
      'Track legal documents required by election type.',
      'Use official IEBC sources for procedural updates.',
    ],
    commonMistakes: [
      'Applying one election process to all offices.',
      'Missing office-specific compliance requirements.',
      'Relying on unofficial procedural interpretations.',
    ],
  },
  '/political-parties-registration-kenya': {
    whoShouldRead: 'Political organizers handling party registration and regulatory compliance.',
    practicalChecklist: [
      'Review statutory thresholds and documentation requirements.',
      'Prepare governance documents and membership data accurately.',
      'Track submission milestones and regulator feedback.',
      'Set compliance process for post-registration obligations.',
    ],
    commonMistakes: [
      'Submitting incomplete constitutional or governance documents.',
      'Ignoring ongoing compliance after initial registration.',
      'Missing legal timelines for mandatory updates.',
    ],
  },
  '/election-petitions-disputes-kenya': {
    whoShouldRead: 'Candidates and voters preparing election petitions or legal responses.',
    practicalChecklist: [
      'Identify correct forum and strict filing timeline.',
      'Compile documentary and witness evidence early.',
      'Structure pleadings around verifiable legal issues.',
      'Prepare for costs and procedural requirements.',
    ],
    commonMistakes: [
      'Filing outside statutory timelines.',
      'Presenting broad complaints without specific evidence.',
      'Underestimating procedural and cost implications.',
    ],
  },
  '/citizens-rights-duties-elections-kenya': {
    whoShouldRead: 'Voters seeking practical understanding of electoral rights and responsibilities.',
    practicalChecklist: [
      'Verify voter details and station information ahead of time.',
      'Understand conduct standards at polling venues.',
      'Report violations through proper legal channels.',
      'Keep evidence where formal complaints may be required.',
    ],
    commonMistakes: [
      'Assuming all complaints can be made informally.',
      'Ignoring official dispute reporting pathways.',
      'Failing to record incident details immediately.',
    ],
  },
  '/become-candidate-kenya': {
    whoShouldRead: 'Prospective candidates preparing nomination and compliance requirements.',
    practicalChecklist: [
      'Confirm eligibility criteria for your target office.',
      'Prepare nomination documents and supporter records.',
      'Track key deadlines for clearance and submissions.',
      'Review campaign compliance obligations early.',
    ],
    commonMistakes: [
      'Starting nomination prep too close to deadlines.',
      'Using incomplete or inconsistent candidate documentation.',
      'Ignoring campaign finance and conduct rules.',
    ],
  },
  '/iebc-contacts-offices-kenya': {
    whoShouldRead: 'Users who need official electoral contacts for support, updates, or complaints.',
    practicalChecklist: [
      'Confirm the correct regional office for your issue.',
      'Prepare clear reference details before outreach.',
      'Record communication dates and responses received.',
      'Escalate unresolved issues within formal channels.',
    ],
    commonMistakes: [
      'Contacting the wrong office for jurisdiction-specific issues.',
      'Submitting vague requests without reference details.',
      'Failing to keep communication records for follow-up.',
    ],
  },
  '/sole-proprietorship-registration-kenya': {
    whoShouldRead: 'Founders setting up solo-owned businesses with minimal structure complexity.',
    practicalChecklist: [
      'Assess liability exposure before choosing structure.',
      'Reserve name and complete registration details accurately.',
      'Set bookkeeping and tax compliance process immediately.',
      'Confirm permit and sector licensing obligations.',
    ],
    commonMistakes: [
      'Assuming registration alone satisfies all legal requirements.',
      'Running business without clear financial records.',
      'Ignoring permit renewals and sector approvals.',
    ],
  },
  '/company-cr12-and-search-kenya': {
    whoShouldRead: 'Businesses and stakeholders needing verified company record extracts.',
    practicalChecklist: [
      'Use correct company identifiers for search requests.',
      'Verify extracted details against transaction requirements.',
      'Retain certified records where due diligence is needed.',
      'Address discrepancies before proceeding with transactions.',
    ],
    commonMistakes: [
      'Relying on outdated record extracts.',
      'Proceeding despite unresolved director/shareholding inconsistencies.',
      'Using unofficial records in high-risk transactions.',
    ],
  },
  '/company-annual-returns-kenya': {
    whoShouldRead: 'Directors and company officers responsible for recurring statutory filings.',
    practicalChecklist: [
      'Track filing cycle dates in a compliance calendar.',
      'Prepare accurate director and shareholding updates.',
      'Submit returns before deadlines and keep confirmations.',
      'Review penalties risk for delayed filings.',
    ],
    commonMistakes: [
      'Missing annual filing deadlines repeatedly.',
      'Submitting returns with outdated company particulars.',
      'Not retaining proof of filing and payment.',
    ],
  },
  '/employment-contracts-kenya': {
    whoShouldRead: 'Employers and employees drafting or reviewing enforceable contract terms.',
    practicalChecklist: [
      'Ensure role, compensation, and duties are clearly defined.',
      'Include leave, termination, and dispute clauses accurately.',
      'Review compliance with minimum statutory standards.',
      'Keep signed copies and amendment history organized.',
    ],
    commonMistakes: [
      'Using vague terms that are difficult to enforce.',
      'Copying templates without legal localization.',
      'Failing to update contracts when terms change.',
    ],
  },
  '/labour-dispute-resolution-kenya': {
    whoShouldRead: 'Workers and employers resolving workplace disputes through proper channels.',
    practicalChecklist: [
      'Document facts and communication chronologically.',
      'Use internal grievance pathways where available.',
      'Escalate unresolved matters through lawful forums.',
      'Prepare supporting records before formal filing.',
    ],
    commonMistakes: [
      'Escalating disputes without documented attempts at resolution.',
      'Missing limitation or procedural deadlines.',
      'Submitting claims without core employment records.',
    ],
  },
  '/occupational-health-safety-kenya': {
    whoShouldRead: 'Employers and workers managing workplace safety compliance obligations.',
    practicalChecklist: [
      'Conduct periodic risk assessments and document findings.',
      'Implement safety training and reporting workflows.',
      'Maintain incident logs and corrective action records.',
      'Review compliance status against sector requirements.',
    ],
    commonMistakes: [
      'Treating safety procedures as one-time setup tasks.',
      'Failing to document incidents and follow-up actions.',
      'Ignoring training records and compliance evidence.',
    ],
  },
};

const categoryContextualLinks: Record<ContentCategory, ContextualLink[]> = {
  family: [
    { to: '/divorce-in-kenya', label: 'Divorce Process in Kenya' },
    { to: '/child-law-kenya', label: 'Child Law and Custody' },
    { to: '/succession-inheritance-law-kenya', label: 'Succession and Inheritance Law' },
    { to: '/how-to-write-a-will-kenya', label: 'How to Write a Will' },
    { to: '/letters-of-administration-probate-kenya', label: 'Probate and Letters of Administration' },
    { to: '/contactus', label: 'Talk to a Family Lawyer' },
  ],
  land: [
    { to: '/land-ownership-title-deed-verification-kenya', label: 'Title Deed Verification' },
    { to: '/land-transfer-process-kenya', label: 'Land Transfer Process' },
    { to: '/how-to-buy-land-safely-kenya', label: 'How to Buy Land Safely' },
    { to: '/land-disputes-kenya', label: 'Land Disputes Guide' },
    { to: '/lost-title-deed-replacement-kenya', label: 'Lost Title Replacement' },
    { to: '/contactus', label: 'Get Land Law Support' },
  ],
  business: [
    { to: '/how-to-register-business-kenya', label: 'Business Registration Guide' },
    { to: '/business-name-search-kenya', label: 'Business Name Search' },
    { to: '/limited-company-registration-kenya', label: 'Limited Company Registration' },
    { to: '/company-annual-returns-kenya', label: 'Annual Returns Requirements' },
    { to: '/business-tax-obligations-kenya', label: 'Business Tax Obligations' },
    { to: '/contactus', label: 'Get Business Law Support' },
  ],
  elections: [
    { to: '/understanding-iebc-kenya', label: 'Understanding IEBC' },
    { to: '/how-to-register-as-a-voter-kenya', label: 'Voter Registration Guide' },
    { to: '/elections-in-kenya', label: 'Elections Process Overview' },
    { to: '/election-petitions-disputes-kenya', label: 'Election Petitions and Disputes' },
    { to: '/election-offences-penalties-kenya', label: 'Election Offences and Penalties' },
    { to: '/contactus', label: 'Get Election Law Support' },
  ],
  employment: [
    { to: '/kenya-employment-labour-laws', label: 'Employment Law Overview' },
    { to: '/employment-contracts-kenya', label: 'Employment Contracts Guide' },
    { to: '/labour-dispute-resolution-kenya', label: 'Labour Dispute Resolution' },
    { to: '/termination-redundancy-severance-kenya', label: 'Termination and Redundancy' },
    { to: '/occupational-health-safety-kenya', label: 'Occupational Health and Safety' },
    { to: '/contactus', label: 'Get Employment Law Support' },
  ],
  general: [
    { to: '/howitworks', label: 'How Wakili Works' },
    { to: '/services', label: 'Legal Services' },
    { to: '/updates', label: 'Legal News and Updates' },
    { to: '/about', label: 'About Wakili' },
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/contactus', label: 'Contact Legal Team' },
  ],
};

const routeContextualLinks: Record<string, ContextualLink[]> = {
  '/': [
    { to: '/family-law-divorce-kenya', label: 'Family Law in Kenya' },
    { to: '/land-disputes-kenya', label: 'Land Law in Kenya' },
    { to: '/how-to-register-business-kenya', label: 'Business Law in Kenya' },
    { to: '/elections-in-kenya', label: 'Election Law in Kenya' },
    { to: '/kenya-employment-labour-laws', label: 'Employment Law in Kenya' },
    { to: '/contactus', label: 'Speak to a Lawyer' },
  ],
  '/updates': [
    { to: '/elections-in-kenya', label: 'Election Law Updates' },
    { to: '/business-tax-obligations-kenya', label: 'Business Compliance Updates' },
    { to: '/land-disputes-kenya', label: 'Land Law Updates' },
    { to: '/kenya-employment-labour-laws', label: 'Employment Law Updates' },
    { to: '/family-law-divorce-kenya', label: 'Family Law Updates' },
    { to: '/contactus', label: 'Request Legal Clarification' },
  ],
};

const categoryEditorialProfiles: Record<ContentCategory, EditorialTeamInfo> = {
  family: {
    author: {
      name: 'Wakili Family Law Desk',
      role: 'Legal Content Author',
      experience: 'Focuses on practical family and succession procedure guidance in Kenya.',
      focusAreas: ['Divorce', 'Child Law', 'Succession'],
    },
    reviewer: {
      name: 'Wakili Senior Legal Reviewer',
      role: 'Advocate Reviewer',
      experience: 'Reviews legal procedure accuracy and public guidance clarity.',
      focusAreas: ['Court Procedure', 'Legal Drafting', 'Regulatory Compliance'],
    },
  },
  land: {
    author: {
      name: 'Wakili Land Law Desk',
      role: 'Legal Content Author',
      experience: 'Produces practical guides on land transfer, title checks, and disputes.',
      focusAreas: ['Title Verification', 'Transfer Process', 'Land Disputes'],
    },
    reviewer: {
      name: 'Wakili Senior Legal Reviewer',
      role: 'Advocate Reviewer',
      experience: 'Checks procedural correctness and source alignment for land law topics.',
      focusAreas: ['Property Law', 'Evidence', 'Dispute Resolution'],
    },
  },
  business: {
    author: {
      name: 'Wakili Business Law Desk',
      role: 'Legal Content Author',
      experience: 'Builds guidance on company setup and ongoing statutory compliance in Kenya.',
      focusAreas: ['Business Registration', 'Company Filings', 'Tax Compliance'],
    },
    reviewer: {
      name: 'Wakili Senior Legal Reviewer',
      role: 'Advocate Reviewer',
      experience: 'Reviews legal and compliance accuracy for commercial content.',
      focusAreas: ['Corporate Law', 'Regulatory Filings', 'Commercial Risk'],
    },
  },
  elections: {
    author: {
      name: 'Wakili Elections Law Desk',
      role: 'Legal Content Author',
      experience: 'Develops guides on electoral process, timelines, and dispute pathways.',
      focusAreas: ['Election Procedure', 'Petitions', 'Voter Rights'],
    },
    reviewer: {
      name: 'Wakili Senior Legal Reviewer',
      role: 'Advocate Reviewer',
      experience: 'Validates election process guidance against current institutions and law.',
      focusAreas: ['Constitutional Law', 'Election Disputes', 'Public Law'],
    },
  },
  employment: {
    author: {
      name: 'Wakili Employment Law Desk',
      role: 'Legal Content Author',
      experience: 'Creates practical guidance on contracts, workplace disputes, and termination.',
      focusAreas: ['Employment Contracts', 'Dispute Resolution', 'Termination Process'],
    },
    reviewer: {
      name: 'Wakili Senior Legal Reviewer',
      role: 'Advocate Reviewer',
      experience: 'Reviews labour law procedure and compliance accuracy.',
      focusAreas: ['Labour Law', 'Workplace Compliance', 'Procedural Fairness'],
    },
  },
  general: {
    author: {
      name: 'Wakili Legal Editorial Team',
      role: 'Legal Content Author',
      experience: 'Maintains practical legal guidance for Kenyan users across topics.',
      focusAreas: ['Public Legal Education', 'Procedure Guides', 'Compliance Basics'],
    },
    reviewer: {
      name: 'Wakili Senior Legal Reviewer',
      role: 'Advocate Reviewer',
      experience: 'Ensures public guidance remains clear, relevant, and legally grounded.',
      focusAreas: ['Legal Review', 'Source Verification', 'Content Quality'],
    },
  },
};

const routeEditorialProfiles: Record<string, Partial<EditorialTeamInfo>> = {
  '/family-law-divorce-kenya': {
    author: {
      name: 'Wakili Family Law Desk',
      role: 'Family Law Content Author',
      experience: 'Focuses on divorce, custody, and maintenance process guidance in Kenya.',
      focusAreas: ['Divorce', 'Custody', 'Maintenance'],
    },
  },
  '/land-disputes-kenya': {
    author: {
      name: 'Wakili Land Law Desk',
      role: 'Land Law Content Author',
      experience: 'Focuses on title disputes, land evidence strategy, and legal remedies.',
      focusAreas: ['Land Disputes', 'Title Claims', 'Remedies'],
    },
  },
  '/how-to-register-business-kenya': {
    author: {
      name: 'Wakili Business Law Desk',
      role: 'Business Compliance Content Author',
      experience: 'Focuses on entity setup and practical compliance workflow guidance.',
      focusAreas: ['Entity Setup', 'Filings', 'Compliance'],
    },
  },
  '/elections-in-kenya': {
    author: {
      name: 'Wakili Elections Law Desk',
      role: 'Election Process Content Author',
      experience: 'Focuses on election timelines, process integrity, and legal pathways.',
      focusAreas: ['Election Timelines', 'Complaints', 'Petitions'],
    },
  },
  '/kenya-employment-labour-laws': {
    author: {
      name: 'Wakili Employment Law Desk',
      role: 'Employment Law Content Author',
      experience: 'Focuses on workplace rights, obligations, and dispute procedure guidance.',
      focusAreas: ['Employment Rights', 'Procedure', 'Disputes'],
    },
  },
};

const categoryEvidenceNotes: Record<ContentCategory, EvidenceNote[]> = {
  family: [
    {
      claim: 'Family law outcomes depend heavily on evidence quality and procedural compliance.',
      verificationTip: 'Review procedural requirements and recent case guidance before filing.',
      sourceLabel: 'Kenya Law Reports',
    },
    {
      claim: 'Interim orders can materially affect family case trajectory.',
      verificationTip: 'Check available interim remedies relevant to your facts early.',
      sourceLabel: 'Judiciary of Kenya',
    },
  ],
  land: [
    {
      claim: 'Land disputes are usually document and registry evidence driven.',
      verificationTip: 'Confirm title and registry records before taking legal action.',
      sourceLabel: 'ArdhiSasa Platform',
    },
    {
      claim: 'Transfer and title issues require strict procedural compliance.',
      verificationTip: 'Check statutory forms and consents before execution.',
      sourceLabel: 'Ministry of Lands and Physical Planning',
    },
  ],
  business: [
    {
      claim: 'Business setup success depends on accurate filing and ongoing compliance.',
      verificationTip: 'Validate registration entries and maintain a compliance calendar.',
      sourceLabel: 'eCitizen Business Registration Service',
    },
    {
      claim: 'Tax and statutory obligations continue after registration.',
      verificationTip: 'Cross-check recurring filing obligations against official notices.',
      sourceLabel: 'Kenya Revenue Authority',
    },
  ],
  elections: [
    {
      claim: 'Election disputes are highly time-sensitive and forum-specific.',
      verificationTip: 'Confirm jurisdiction and filing timelines immediately when issues arise.',
      sourceLabel: 'IEBC Official Website',
    },
    {
      claim: 'Evidence quality often determines petition viability.',
      verificationTip: 'Preserve official forms, logs, and witness records systematically.',
      sourceLabel: 'Kenya Law Reports',
    },
  ],
  employment: [
    {
      claim: 'Employment disputes often hinge on documented procedure and fairness.',
      verificationTip: 'Keep complete records of notices, hearings, and outcomes.',
      sourceLabel: 'Employment and Labour Relations Court',
    },
    {
      claim: 'Contract clarity and policy compliance reduce labour risk significantly.',
      verificationTip: 'Review contracts and HR processes against statutory standards.',
      sourceLabel: 'Ministry of Labour and Social Protection',
    },
  ],
  general: [
    {
      claim: 'Official legal sources should guide key legal decisions.',
      verificationTip: 'Cross-check guidance against primary institutions before acting.',
      sourceLabel: 'Kenya Law Reports',
    },
    {
      claim: 'Case-specific advice remains critical even with detailed legal guides.',
      verificationTip: 'Engage a qualified advocate for strategy and representation decisions.',
      sourceLabel: 'Judiciary of Kenya',
    },
  ],
};

const routeEvidenceNotes: Record<string, EvidenceNote[]> = {
  '/family-law-divorce-kenya': [
    {
      claim: 'Child welfare and financial evidence are central to many divorce outcomes.',
      verificationTip: 'Compile dated records of childcare, schooling, and support costs.',
      sourceLabel: 'Kenya Law Reports',
    },
  ],
  '/land-disputes-kenya': [
    {
      claim: 'Boundary and ownership disputes require consistent documentary proof.',
      verificationTip: 'Preserve survey records, searches, and transaction chain documents.',
      sourceLabel: 'ArdhiSasa Platform',
    },
  ],
  '/how-to-register-business-kenya': [
    {
      claim: 'Most registration delays come from incomplete or inconsistent filings.',
      verificationTip: 'Verify name, ownership, and filing details before submission.',
      sourceLabel: 'eCitizen Business Registration Service',
    },
  ],
  '/elections-in-kenya': [
    {
      claim: 'Missing election timelines can invalidate otherwise valid complaints.',
      verificationTip: 'Document dates and submit through the correct legal forum promptly.',
      sourceLabel: 'IEBC Official Website',
    },
  ],
  '/kenya-employment-labour-laws': [
    {
      claim: 'Procedural fairness records are critical in labour disputes.',
      verificationTip: 'Maintain complete notice, hearing, and outcome documentation.',
      sourceLabel: 'Employment and Labour Relations Court',
    },
  ],
};

const categoryAudienceTemplates: Record<ContentCategory, string> = {
  family: 'People dealing with {topic} and related family law decisions in Kenya.',
  land: 'People navigating {topic} and property rights procedures in Kenya.',
  business: 'Entrepreneurs and businesses handling {topic} and compliance obligations in Kenya.',
  elections: 'Voters, candidates, and stakeholders seeking clarity on {topic} in Kenya.',
  employment: 'Employees and employers managing {topic} obligations under Kenyan labour law.',
  general: 'Readers seeking practical guidance on {topic} and how to take compliant next steps in Kenya.',
};

const categoryChecklistTemplates: Record<ContentCategory, string[]> = {
  family: [
    'Define your objective for {topic} clearly before legal action.',
    'Collect identity and supporting family records early.',
    'Organize evidence in a dated timeline for easier review.',
    'Confirm urgent interim relief options with legal counsel.',
  ],
  land: [
    'Verify title, ownership, and encumbrance details for {topic}.',
    'Keep all agreements and property records in one file.',
    'Document site facts with date-stamped evidence where relevant.',
    'Confirm transfer, registry, and consent requirements early.',
  ],
  business: [
    'Map legal and compliance requirements related to {topic}.',
    'Prepare all registration and statutory records accurately.',
    'Set filing reminders for recurring obligations.',
    'Retain submission confirmations and payment receipts.',
  ],
  elections: [
    'Track official timelines relevant to {topic}.',
    'Use official IEBC and legal channels for updates.',
    'Preserve documentary evidence for any complaint process.',
    'Escalate disputes through the correct legal forum quickly.',
  ],
  employment: [
    'Review contracts and policies relevant to {topic}.',
    'Document communications, notices, and meeting outcomes.',
    'Apply procedural fairness consistently in workplace actions.',
    'Escalate unresolved issues through lawful dispute pathways.',
  ],
  general: [
    'Clarify the legal issue and desired outcome for {topic}.',
    'Gather supporting documents before consultations.',
    'Cross-check guidance with official public sources.',
    'Seek case-specific legal advice before critical decisions.',
  ],
};

const categoryMistakeTemplates: Record<ContentCategory, string[]> = {
  family: [
    'Proceeding on assumptions without records related to {topic}.',
    'Letting emotion replace evidence in legal filings.',
    'Ignoring procedural timelines and service requirements.',
  ],
  land: [
    'Making property decisions without full due diligence on {topic}.',
    'Relying on informal assurances instead of official records.',
    'Delaying legal action after evidence becomes harder to secure.',
  ],
  business: [
    'Treating {topic} as a one-time task instead of ongoing compliance.',
    'Submitting incomplete or inconsistent filing details.',
    'Missing deadlines due to absent compliance tracking.',
  ],
  elections: [
    'Filing election-related complaints late in {topic} matters.',
    'Using unverified claims instead of admissible evidence.',
    'Choosing the wrong forum for dispute resolution.',
  ],
  employment: [
    'Taking action on {topic} without required procedure.',
    'Failing to document notices, hearings, and decisions.',
    'Ignoring statutory standards during workplace disputes.',
  ],
  general: [
    'Assuming general guidance alone resolves {topic} issues.',
    'Ignoring official source verification before action.',
    'Delaying legal advice until the matter becomes urgent.',
  ],
};

const applyTopic = (value: string, topic: string): string => value.replace('{topic}', topic);

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

export const getRouteDeepContent = (pathname: string, category: ContentCategory): RouteDeepContent => {
  const specific = routeDeepContent[pathname];
  if (specific) return specific;

  const topic = toReadableTitle(pathname).replace(' | Wakili', '');

  return {
    whoShouldRead: applyTopic(categoryAudienceTemplates[category], topic),
    practicalChecklist: categoryChecklistTemplates[category].map((item) => applyTopic(item, topic)),
    commonMistakes: categoryMistakeTemplates[category].map((item) => applyTopic(item, topic)),
  };
};

export const getContextualLinks = (pathname: string, category: ContentCategory): ContextualLink[] => {
  const specific = routeContextualLinks[pathname];
  if (specific) return specific;

  return categoryContextualLinks[category]
    .filter((item) => item.to !== pathname)
    .slice(0, 6);
};

export const getEditorialTeamInfo = (pathname: string, category: ContentCategory): EditorialTeamInfo => {
  const base = categoryEditorialProfiles[category];
  const override = routeEditorialProfiles[pathname];

  return {
    author: {
      ...base.author,
      ...(override?.author ?? {}),
    },
    reviewer: {
      ...base.reviewer,
      ...(override?.reviewer ?? {}),
    },
  };
};

export const getEvidenceNotes = (pathname: string, category: ContentCategory): EvidenceNote[] => {
  const specific = routeEvidenceNotes[pathname];
  if (specific) return specific;

  return categoryEvidenceNotes[category];
};
