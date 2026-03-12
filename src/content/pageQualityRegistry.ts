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
