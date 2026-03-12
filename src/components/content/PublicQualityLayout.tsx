import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCategoryFaqs, getCategorySources, getContextualLinks, getEditorialTeamInfo, getEvidenceNotes, getPageQualityMeta, getRouteDeepContent } from '../../content/pageQualityRegistry';

interface PublicQualityLayoutProps {
  children: React.ReactNode;
}

const SITE_URL = 'https://wakili.co.ke';

const utilityPaths = new Set([
  '/register',
  '/login',
  '/forgot-password',
  '/reset-password',
]);

const policyPaths = new Set([
  '/privacy-policy',
  '/terms',
  '/cookies',
]);

const PublicQualityLayout: React.FC<PublicQualityLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  const isDashboard = pathname.startsWith('/dashboard');
  const isUtility = utilityPaths.has(pathname);
  const isPolicy = policyPaths.has(pathname);
  const showContentModules = !isDashboard && !isUtility;

  const canonicalPath = pathname === '/' ? '' : pathname;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const pageMeta = getPageQualityMeta(pathname);
  const faqs = getCategoryFaqs(pageMeta.category);
  const sourceLinks = getCategorySources(pageMeta.category);
  const deepContent = getRouteDeepContent(pathname, pageMeta.category);
  const contextualLinks = getContextualLinks(pathname, pageMeta.category);
  const editorialTeam = getEditorialTeamInfo(pathname, pageMeta.category);
  const evidenceNotes = getEvidenceNotes(pathname, pageMeta.category);

  const breadcrumbParts = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    ...breadcrumbParts.map((part, index) => {
      const partPath = breadcrumbParts.slice(0, index + 1).join('/');
      return {
        '@type': 'ListItem',
        position: index + 2,
        name: part.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        item: `${SITE_URL}/${partPath}`,
      };
    }),
  ];

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': isPolicy ? 'WebPage' : 'Article',
    headline: pageMeta.title,
    description: pageMeta.description,
    inLanguage: 'en-KE',
    mainEntityOfPage: canonicalUrl,
    datePublished: pageMeta.datePublished,
    dateModified: pageMeta.dateModified,
    about: pageMeta.category,
    author: {
      '@type': 'Person',
      name: editorialTeam.author.name,
      jobTitle: editorialTeam.author.role,
    },
    reviewedBy: {
      '@type': 'Person',
      name: editorialTeam.reviewer.name,
      jobTitle: editorialTeam.reviewer.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wakili',
      url: SITE_URL,
    },
  };

  const faqSchema = {
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
  };

  const howToSchema = deepContent
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: `${pageMeta.title} Practical Checklist`,
        description: pageMeta.description,
        step: deepContent.practicalChecklist.map((item, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: item,
          text: item,
        })),
      }
    : null;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wakili',
    url: SITE_URL,
    inLanguage: 'en-KE',
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Wakili',
    url: SITE_URL,
    areaServed: 'KE',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: editorialTeam.author.name,
    jobTitle: editorialTeam.author.role,
    description: editorialTeam.author.experience,
  };

  const reviewerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: editorialTeam.reviewer.name,
    jobTitle: editorialTeam.reviewer.role,
    description: editorialTeam.reviewer.experience,
  };

  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={pageMeta.description} />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:type" content={isPolicy ? 'website' : 'article'} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMeta.title} />
        <meta name="twitter:description" content={pageMeta.description} />
        <meta name="author" content={editorialTeam.author.name} />
        <meta name="publisher" content="Wakili" />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {showContentModules && <script type="application/ld+json">{JSON.stringify(authorSchema)}</script>}
        {showContentModules && <script type="application/ld+json">{JSON.stringify(reviewerSchema)}</script>}
        {showContentModules && <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>}
        {showContentModules && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        {showContentModules && howToSchema && <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>}
      </Helmet>

      {children}

      {showContentModules && (
        <section className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Editorial Standards</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                This page is reviewed by the {editorialTeam.reviewer.name} and updated for legal relevance in Kenya.
                Content is educational and does not replace legal advice for your specific case.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Published: {new Date(pageMeta.datePublished).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })} • Last updated: {new Date(pageMeta.dateModified).toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Editorial Team</h3>
              <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="font-semibold text-slate-900 dark:text-white">Author: {editorialTeam.author.name}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{editorialTeam.author.role}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{editorialTeam.author.experience}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Focus: {editorialTeam.author.focusAreas.join(' • ')}</p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                  <p className="font-semibold text-slate-900 dark:text-white">Reviewer: {editorialTeam.reviewer.name}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{editorialTeam.reviewer.role}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{editorialTeam.reviewer.experience}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Focus: {editorialTeam.reviewer.focusAreas.join(' • ')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Questions</h3>
              <div className="mt-3 space-y-3">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">{faq.question}</summary>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {deepContent && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Who Should Read This</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{deepContent.whoShouldRead}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Practical Checklist</h4>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
                    {deepContent.practicalChecklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Common Mistakes to Avoid</h4>
                  <ul className="mt-2 space-y-2 list-disc list-inside text-sm text-slate-600 dark:text-slate-300">
                    {deepContent.commonMistakes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Related in This Topic</h3>
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {contextualLinks.map((guide) => (
                  <Link
                    key={guide.to}
                    to={guide.to}
                    className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    {guide.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Primary Legal Sources</h3>
              <ul className="mt-3 space-y-2">
                {sourceLinks.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Evidence and Source Notes</h3>
              <ul className="mt-3 space-y-3">
                {evidenceNotes.map((note) => (
                  <li key={note.claim} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{note.claim}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Verification tip: {note.verificationTip}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Primary reference: {note.sourceLabel}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-300">Need legal help for your exact situation?</p>
                <p className="text-sm text-emerald-800/90 dark:text-emerald-300/90">Talk to a verified Kenyan lawyer through Wakili.</p>
              </div>
              <Link
                to="/contactus"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Contact Legal Team
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PublicQualityLayout;
