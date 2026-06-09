import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeInfo,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  Image as Picture,
  Landmark,
  Mail,
  MessageCircle,
  MessageSquareText,
  RefreshCw,
  Loader2,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type SubmissionState = {
  name: string;
  email: string;
  topic: string;
  comment: string;
};

type TopicCard = {
  title: string;
  description: string;
  icon: React.ElementType;
  points: string[];
};

type SourceCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

type HubPoint = {
  title: string;
  detail: string;
};

type HubFeed = {
  title: string;
  summary: string;
  keyPoints: HubPoint[];
  spotlight: string[];
  lastUpdatedLabel: string;
};

const currentYear = new Date().getFullYear();
const financeBillLabel = `Finance Bill ${currentYear}`;
const canonicalUrl = 'https://wakili.co.ke/finance-bill-kenya';
const mailTarget = 'info@wakili.com';
const whatsappTarget = '254112810203';

const heroKeywords = [
  'Finance Bill Kenya',
  financeBillLabel,
  `Finance Bill ${currentYear} Kenya`,
  'public participation',
  'tax proposals',
  'VAT',
  'excise duty',
  'PAYE',
  'withholding tax',
  'digital services tax',
  'National Assembly',
  'Kenya Law',
  'Kenya Gazette',
  'National Treasury',
  'KRA',
];

const financeTopics: TopicCard[] = [
  {
    title: 'What you should watch for',
    description:
      'Review the tax proposals, rate adjustments, exemptions, penalties, and administrative changes that are most likely to affect your daily costs or compliance.',
    icon: Scale,
    points: ['VAT and excise duty', 'PAYE and payroll deductions', 'Withholding tax and compliance'],
  },
  {
    title: 'How it may affect you',
    description:
      'The Finance Bill can affect individuals, employees, employers, SMEs, investors, and counties by changing the rules you follow or the amounts you pay.',
    icon: Landmark,
    points: ['Households', 'Businesses', 'Public sector and counties'],
  },
  {
    title: 'How to take part',
    description:
      'Kenyan Finance Bill proposals usually move through public participation, committee review, amendments, and final passage before presidential assent, so you can still influence the final text.',
    icon: MessageSquareText,
    points: ['Memorandum submissions', 'Committee stage comments', 'Clause-by-clause review'],
  },
  {
    title: 'What matters most to you',
    description:
      'The most important clauses are often those affecting everyday tax burdens, business costs, payment systems, and the time you have to comply.',
    icon: Search,
    points: ['Tax reliefs', 'New levies and fees', 'Administration and penalties'],
  },
];

const officialSources: SourceCard[] = [
  {
    title: 'National Assembly Bills',
    description: 'Track the Finance Bill as it moves through Parliament and review official legislative publications.',
    href: 'https://www.parliament.go.ke/the-national-assembly/bills',
    icon: Landmark,
  },
  {
    title: 'Kenya Law',
    description: 'Check the legal repository for gazetted texts, amended provisions, and related legal references.',
    href: 'https://new.kenyalaw.org/',
    icon: BookOpen,
  },
  {
    title: 'Kenya Gazette',
    description: 'Use the Gazette for official notices, publications, and final promulgated references.',
    href: 'https://www.kenya-gazette.go.ke/',
    icon: FileText,
  },
  {
    title: 'National Treasury',
    description: 'Follow budget policy statements, tax policy direction, and supporting fiscal documents.',
    href: 'https://www.treasury.go.ke/',
    icon: Globe,
  },
];

const faqs = [
  {
    question: 'What is the Finance Bill in Kenya?',
    answer:
      'The Finance Bill is the annual legislative vehicle used to adjust tax laws, revenue measures, exemptions, administrative powers, and related fiscal rules in Kenya.',
  },
  {
    question: `Where can I read the official ${financeBillLabel}?`,
    answer:
      'Start with the National Assembly bills page, then confirm the official text or gazette notice through Kenya Law and the Kenya Gazette before relying on any summary.',
  },
  {
    question: 'How do I submit comments or a memorandum?',
    answer:
      'Prepare clause-specific comments, explain the impact, and submit them through the Parliament process or by using the Wakili email and WhatsApp submission links on this page.',
  },
  {
    question: 'Does the Finance Bill become law immediately?',
    answer:
      'No. A bill goes through committee scrutiny, debate, possible amendments, passage, and presidential assent before the final law takes effect.',
  },
  {
    question: 'Who should pay attention to the Finance Bill?',
    answer:
      'Individuals, employers, SMEs, corporate taxpayers, sector operators, investors, and anyone affected by VAT, excise duty, PAYE, or withholding tax changes should follow it closely.',
  },
  {
    question: 'Can I rely on social media summaries alone?',
    answer:
      'No. Social media is useful for alerts, but the authoritative text should always come from Parliament, Kenya Law, the Kenya Gazette, or other official government sources.',
  },
];

const readSections = [
  {
    title: 'Clause-by-clause reading',
    description:
      'Read each Finance Bill proposal against the existing tax law to understand whether it changes VAT, excise duty, income tax, penalties, or procedure.',
  },
  {
    title: 'Impact on households and employees',
    description:
      'Look for changes to PAYE, reliefs, levies, digital platforms, or pricing rules that could affect daily living costs and salary deductions.',
  },
  {
    title: 'Impact on SMEs and employers',
    description:
      'Small businesses and employers should watch for compliance costs, payroll reporting changes, and any shift in record-keeping or payment rules.',
  },
  {
    title: 'Public participation and final text',
    description:
      'The public participation stage is where citizens and businesses can influence the final bill before amendments are settled and assent is granted.',
  },
];

const keywordChips = [
  'Finance Bill Kenya',
  `Finance Bill ${currentYear}`,
  'tax proposals',
  'public participation',
  'National Assembly bills',
  'Kenya Law',
  'Kenya Gazette',
  'National Treasury',
  'KRA',
  'VAT',
  'excise duty',
  'PAYE',
  'withholding tax',
  'compliance',
  'memorandum submission',
];

const pageSections = [
  { id: 'top', label: 'Top' },
  { id: 'bill-highlights', label: 'Latest highlights' },
  { id: 'hub-overview', label: 'Hub overview' },
  { id: 'official-sources', label: 'Official sources' },
  { id: 'read-online', label: 'Read online' },
  { id: 'submit-comment', label: 'Submit comment' },
  { id: 'faqs', label: 'FAQs' },
];

const FinanceBillKenya = () => {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [submission, setSubmission] = useState<SubmissionState>({
    name: '',
    email: '',
    topic: 'Finance Bill public comment',
    comment: '',
  });
  const [hubFeed, setHubFeed] = useState<HubFeed | null>(null);
  const [hubFeedLoading, setHubFeedLoading] = useState(true);
  const [hubFeedError, setHubFeedError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('top');
  const [navPinned, setNavPinned] = useState(false);

  const submissionSummary = [
    `Name: ${submission.name || 'Not provided'}`,
    `Email: ${submission.email || 'Not provided'}`,
    `Topic: ${submission.topic || 'Finance Bill public comment'}`,
    `Comment: ${submission.comment || 'No comment entered yet'}`,
    `Source: ${canonicalUrl}`,
  ].join('\n');

  const handleChange = (field: keyof SubmissionState, value: string) => {
    setSubmission((current) => ({ ...current, [field]: value }));
  };

  const loadHubFeed = async () => {
    setHubFeedLoading(true);
    setHubFeedError(null);

    try {
      const response = await fetch('/finance-bill-hub.json', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error(`Unable to load hub feed (${response.status})`);
      }

      const data = (await response.json()) as HubFeed;
      setHubFeed(data);
    } catch (error) {
      setHubFeedError(error instanceof Error ? error.message : 'Unable to load the latest bill highlights.');
    } finally {
      setHubFeedLoading(false);
    }
  };

  useEffect(() => {
    void loadHubFeed();
  }, []);

  useEffect(() => {
    const sectionElements = pageSections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sectionElements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0.15, 0.3, 0.5, 0.75],
      },
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updatePinnedState = () => {
      const heroElement = heroSectionRef.current;

      if (!heroElement) {
        return;
      }

      const pinThreshold = heroElement.offsetHeight - 96;
      const shouldPin = window.scrollY >= pinThreshold;

      if (window.scrollY <= 0) {
        setNavPinned(false);
        return;
      }

      if (shouldPin) {
        setNavPinned(true);
      }
    };

    updatePinnedState();
    window.addEventListener('scroll', updatePinnedState, { passive: true });
    window.addEventListener('resize', updatePinnedState);

    return () => {
      window.removeEventListener('scroll', updatePinnedState);
      window.removeEventListener('resize', updatePinnedState);
    };
  }, []);

  const openEmailDraft = () => {
    const subject = encodeURIComponent(`${financeBillLabel} submission from Wakili`);
    const body = encodeURIComponent(submissionSummary);
    window.location.href = `mailto:${mailTarget}?subject=${subject}&body=${body}`;
  };

  const openWhatsAppDraft = () => {
    const body = encodeURIComponent(submissionSummary);
    window.open(`https://wa.me/${whatsappTarget}?text=${body}`, '_blank', 'noopener,noreferrer');
  };

  const canSubmit = submission.comment.trim().length >= 10;

  return (
    <>
      <Helmet>
        <title>{`${financeBillLabel} Kenya | Finance Bill hub, latest highlights, and public participation`}</title>
        <meta
          name="description"
          content={`${financeBillLabel} Kenya explained in detail, including official government sources, public participation, tax proposals, and how to submit comments by email or WhatsApp.`}
        />
        <meta name="keywords" content={heroKeywords.join(', ')} />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <meta property="og:title" content={`${financeBillLabel} Kenya | Wakili`} />
        <meta
          property="og:description"
          content={`Detailed ${financeBillLabel} Kenya guide with official government links, public participation, FAQs, and submission tools.`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${financeBillLabel} Kenya | Wakili`} />
        <meta
          name="twitter:description"
          content={`Read the ${financeBillLabel} Kenya guide, follow official links, and send your comments to Wakili.`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wakili.co.ke/' },
              { '@type': 'ListItem', position: 2, name: 'Finance Bill Kenya', item: canonicalUrl },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${financeBillLabel} Kenya`,
            description: `Detailed ${financeBillLabel} Kenya guide with official government links, public participation, FAQs, and comment submission options.`,
            inLanguage: 'en-KE',
            mainEntityOfPage: canonicalUrl,
            publisher: {
              '@type': 'Organization',
              name: 'Wakili',
              url: 'https://wakili.co.ke',
            },
            datePublished: `${currentYear}-01-01`,
            dateModified: `${currentYear}-01-01`,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section ref={heroSectionRef} className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.20),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%)]" />
          <div className="absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />

          <div id="top" className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12 scroll-mt-24">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link to="/" className="transition-colors hover:text-slate-900">
                    Home
                  </Link>
                </li>
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <li className="font-medium text-slate-900">Finance Bill Kenya</li>
              </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                  <Sparkles className="h-4 w-4" />
                  Updated for {currentYear} and built as a living Finance Bill hub
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                    {financeBillLabel} Kenya: definition, relevance, importance, official sources, and public participation
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-slate-700 sm:text-xl">
                    This page is a public hub for the Finance Bill in Kenya. It helps you understand what the bill means for you,
                    what might change in your day-to-day life or business, where to read the official text, and how to submit comments for review.
                    It is structured to remain useful for each coming Finance Bill through automatic year updates.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="#read-online"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-transform hover:-translate-y-0.5"
                  >
                    Read the hub
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#official-sources"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400"
                  >
                    Official sources
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://wa.me/${whatsappTarget}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp +254 112 810 203
                  </a>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Start here</p>
                      <p className="text-sm text-slate-600">Read the quick summary, then use the sticky navigation below this hero to jump straight to the section you need.</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: 'Public participation', value: 'Clause-specific comments' },
                    { label: 'Official sources', value: 'Parliament, Kenya Law, Gazette' },
                    { label: 'Submission channels', value: 'Email and WhatsApp' },
                    { label: 'Page relevance', value: `Automatic ${currentYear} update` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { value: '7', label: 'Live sections' },
                    { value: '4', label: 'Official sources' },
                    { value: '2', label: 'Direct submission channels' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                      <div className="text-3xl font-black text-slate-950">{item.value}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Scale className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Reading focus</p>
                    <h2 className="text-xl font-bold text-slate-950">What this Finance Bill hub covers</h2>
                  </div>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
                  <p>
                    This hub follows the Finance Bill Kenya process from definition to final assent. It explains the tax proposals,
                    public participation process, and the official sources that should always be checked first.
                  </p>
                  <p>
                    It also acts as a working reference for households, business owners, tax teams, advocates, and policy readers who
                    need a clear place to read, compare, and respond to the bill.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">Best for</p>
                  <p className="mt-1">Taxpayers, employers, SMEs, corporate teams, accountants, legal researchers, and anyone following Kenya’s annual tax reform cycle.</p>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                      <Picture className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Quick jump</p>
                      <p className="text-xs text-slate-500">Tap a pill below to get to what you need faster</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <a href="#bill-highlights" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-emerald-300 hover:text-emerald-800">
                      See what changed
                    </a>
                    <a href="#submit-comment" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-emerald-300 hover:text-emerald-800">
                      Send your view
                    </a>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    <img src="/wakililogo.png" alt="Wakili logo" className="h-36 w-full object-cover" />
                    <figcaption className="px-4 py-3 text-xs text-slate-600">Wakili public law hub</figcaption>
                  </figure>
                  <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
                    <img src="/logo.png" alt="Wakili brand logo" className="h-36 w-full object-cover object-center" />
                    <figcaption className="px-4 py-3 text-xs text-slate-600">Official brand marker for the finance bill guide</figcaption>
                  </figure>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div
          className={
            navPinned
              ? 'fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl'
              : 'relative z-40 border-b border-slate-200/80 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl'
          }
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto py-3 text-sm whitespace-nowrap">
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-950 px-4 py-2 font-semibold text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
                Jump to a section
              </span>
              {pageSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={activeSection === section.id ? 'page' : undefined}
                  className={`rounded-full border px-4 py-2 font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {navPinned ? <div aria-hidden="true" className="h-0" /> : null}

        <section id="bill-highlights" className="scroll-mt-24 border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Latest bill highlights
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">The quick points you need first</h2>
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  This panel fetches the latest bill briefing and shows the most important points first, so you can understand the annual tax agenda without reading every page immediately.
                </p>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>

                    {navPinned ? <div aria-hidden="true" className="h-16" /> : null}
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Feed status</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {hubFeedLoading ? 'Loading latest finance bill highlights...' : hubFeedError ? 'Feed unavailable, using page content' : hubFeed?.lastUpdatedLabel || 'Latest feed loaded'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={loadHubFeed}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-300 hover:text-emerald-800"
                    >
                      {hubFeedLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      Refresh feed
                    </button>
                  </div>
                  {hubFeedError ? <p className="mt-3 text-sm text-rose-600">{hubFeedError}</p> : null}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {(hubFeed?.keyPoints ?? [
                    { title: 'Revenue measures', detail: 'Watch VAT, excise duty, levies, fees, and tax administration clauses.' },
                    { title: 'Who feels it', detail: 'Families, employers, SMEs, investors, and service providers.' },
                    { title: 'Reading order', detail: 'Start with the memorandum, then follow clause by clause, then compare with law.' },
                    { title: 'Public participation', detail: 'Comments and memoranda can be submitted before final passage.' },
                  ]).map((point) => (
                    <button
                      key={point.title}
                      type="button"
                      onClick={() => setActiveSection('read-online')}
                      className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                    >
                      <h3 className="text-lg font-bold text-slate-950">{point.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-700">{point.detail}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        Open the guide
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <img src="/wakililogo.png" alt="Stylized finance bill hub card" className="h-64 w-full object-cover" />
                  <div className="p-5">
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      <Picture className="h-3.5 w-3.5" />
                      Visual guide
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950">A cleaner reading experience</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      The hub uses softer surfaces, strong contrast, and image blocks to make the page feel more polished and easier to stay on.
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
                  <img src="/logo.png" alt="Wakili logo card" className="h-64 w-full object-cover object-center" />
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Brand visual</p>
                    <h3 className="mt-2 text-xl font-bold text-slate-950">A page designed for easier decisions</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      A more attractive presentation helps you move from curiosity to action, whether you want to read, compare, or submit comments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'What is the Finance Bill?',
                  text:
                    'The Finance Bill is the annual legislative instrument that proposes changes to tax laws, fees, exemptions, and revenue administration in Kenya.',
                },
                {
                  title: 'Why is it relevant?',
                  text:
                    'It can affect the cost of living, payroll, business operations, compliance duties, and the way taxes are collected across the economy.',
                },
                {
                  title: 'Why is it important?',
                  text:
                    'It shapes the legal rules that govern public revenue, determines the practical impact of budget policy, and gives the public a chance to respond before final enactment.',
                },
              ].map((item) => (
                <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                  <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="hub-overview" className="scroll-mt-24 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
                <BookOpen className="h-3.5 w-3.5" />
                Finance Bill hub overview
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">How to use this page for fast answers</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                The hub combines definition, relevance, importance, official links, reading guidance, and submission tools so you can move through the page quickly and get what you need without hunting around.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {readSections.map((section) => (
                <article key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:bg-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">{section.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{section.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-slate-950">
                <BadgeInfo className="h-5 w-5 text-sky-700" />
                <h3 className="text-lg font-bold">Keyword coverage for Finance Bill Kenya searches</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {keywordChips.map((keyword) => (
                  <span key={keyword} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-800">
                <CalendarDays className="h-3.5 w-3.5" />
                Why the Finance Bill matters
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Why it matters to you</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                The bill turns budget ideas into enforceable law. A single clause can change the amount you pay, the way you report, or the evidence you must keep, which is why a reader-friendly guide matters.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {financeTopics.map((topic) => (
                <article key={topic.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <topic.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{topic.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-700">{topic.description}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-slate-700">
                    {topic.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
                <Globe className="h-3.5 w-3.5" />
                Official government sources
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Where to read the Finance Bill officially</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Always confirm the bill from official sources before relying on commentary, summaries, or forwarded messages. This page points you to the primary repositories.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {officialSources.map((source) => (
                <a
                  key={source.title}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-emerald-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                      <source.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">{source.title}</h3>
                      <p className="mt-1 text-sm text-slate-700">{source.description}</p>
                    </div>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-transform group-hover:translate-x-1">
                    Open source
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="read-online" className="scroll-mt-24 border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-800">
                <Scale className="h-3.5 w-3.5" />
                Read the bill on our platform
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">How to read it without getting lost</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Use this section to move from definition to action. First identify the proposed change, then compare it with the current law, and finally see what it means for households, employers, and businesses like yours.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: 'Start with the memorandum',
                  text: 'The memorandum normally explains why the bill is being introduced and which revenue measures are being proposed.',
                },
                {
                  title: 'Read clause by clause',
                  text: 'A clause-by-clause approach reveals what is new, what is being amended, and what might affect compliance.',
                },
                {
                  title: 'Check the tax category',
                  text: 'Look for VAT, excise duty, PAYE, income tax, withholding tax, penalties, and administrative changes.',
                },
                {
                  title: 'Compare with official law',
                  text: 'Use Parliament, Kenya Law, Kenya Gazette, and Treasury updates to confirm the final legal position.',
                },
              ].map((item) => (
                <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="submit-comment" className="scroll-mt-24 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                  <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-800">
                  <Send className="h-3.5 w-3.5" />
                  Send your view
                </p>
                <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Share your comment in a few steps</h2>
                <p className="mt-4 text-lg leading-8 text-slate-700">
                  Use the form below to draft your submission. We will open your email client or WhatsApp so you can send it to our team at {mailTarget} or +254 112 810 203.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    openEmailDraft();
                  }}
                  className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Your name</span>
                      <input
                        value={submission.name}
                        onChange={(event) => handleChange('name', event.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                        placeholder="Enter your name"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Email address</span>
                      <input
                        type="email"
                        value={submission.email}
                        onChange={(event) => handleChange('email', event.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>

                  <label className="mt-5 block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Topic or clause</span>
                    <input
                      value={submission.topic}
                      onChange={(event) => handleChange('topic', event.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                      placeholder="Example: VAT clause, PAYE, excise duty, or public participation"
                    />
                  </label>

                  <label className="mt-5 block space-y-2">
                    <span className="text-sm font-medium text-slate-700">Your comment or submission</span>
                    <textarea
                      rows={8}
                      value={submission.comment}
                      onChange={(event) => handleChange('comment', event.target.value)}
                      className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500"
                      placeholder="Write a clear, clause-specific comment that can be shared with Wakili."
                    />
                  </label>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      Send by email
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={openWhatsAppDraft}
                      disabled={!canSubmit}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                    >
                      Send on WhatsApp
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-4 text-xs leading-6 text-slate-500">
                    Clicking a button opens your email client or WhatsApp with the submission text prefilled. No login is required.
                  </p>
                </form>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-950">Why this hub helps you</h3>
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      It gives you one place to understand the bill, not just a quick summary.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      It links to official sources so you can verify the live text.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      It helps you submit commentary quickly in a format that is easy to send.
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">How to make your comment stronger</h3>
                  </div>
                  <ul className="mt-5 space-y-3 text-sm text-slate-700">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Mention the clause, tax type, or proposal you want reviewed.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Explain how the Finance Bill proposal affects your household, business, or sector.
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      Keep the tone practical and evidence-based so it can be forwarded quickly.
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                      <Mail className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950">Contact us directly</h3>
                  </div>
                  <div className="mt-5 space-y-3 text-sm text-slate-700">
                    <a href={`mailto:${mailTarget}`} className="flex items-center gap-3 transition-colors hover:text-slate-950">
                      <Mail className="h-4 w-4 text-emerald-600" />
                      {mailTarget}
                    </a>
                    <a
                      href={`https://wa.me/${whatsappTarget}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 transition-colors hover:text-slate-950"
                    >
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      +254 112 810 203
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faqs" className="scroll-mt-24 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-800">
                <MessageSquareText className="h-3.5 w-3.5" />
                Finance Bill FAQs
              </p>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Common questions about the Finance Bill in Kenya</h2>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-emerald-200 open:bg-white">
                  <summary className="cursor-pointer list-none text-lg font-semibold text-slate-950">
                    <span className="flex items-center justify-between gap-4">
                      {faq.question}
                      <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-700">{faq.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm leading-7 text-emerald-900">
              This hub is set up to stay current each year: the page title, keyword focus, content sections, and schema update with the current year so the Finance Bill page remains relevant for future annual bills.
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default FinanceBillKenya;