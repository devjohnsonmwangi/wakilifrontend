import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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

const relatedGuides = [
  { to: '/family-law-divorce-kenya', label: 'Family Law in Kenya' },
  { to: '/land-disputes-kenya', label: 'Land Disputes in Kenya' },
  { to: '/how-to-register-business-kenya', label: 'Business Registration in Kenya' },
  { to: '/kenya-employment-labour-laws', label: 'Employment Law in Kenya' },
  { to: '/updates', label: 'Legal News & Updates' },
  { to: '/howitworks', label: 'How Wakili Works' },
];

const toReadableTitle = (pathname: string): string => {
  if (pathname === '/') return 'Find a Lawyer in Kenya';
  const slug = pathname.replace(/^\//, '').replace(/-/g, ' ').trim();
  if (!slug) return 'Legal Services Kenya';
  return slug
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PublicQualityLayout: React.FC<PublicQualityLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();

  const isDashboard = pathname.startsWith('/dashboard');
  const isUtility = utilityPaths.has(pathname);
  const isPolicy = policyPaths.has(pathname);
  const showContentModules = !isDashboard && !isUtility;

  const canonicalPath = pathname === '/' ? '' : pathname;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const headline = toReadableTitle(pathname);
  const dateModified = new Date().toISOString();

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
    headline,
    inLanguage: 'en-KE',
    mainEntityOfPage: canonicalUrl,
    dateModified,
    author: {
      '@type': 'Organization',
      name: 'Wakili Legal Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Wakili',
      url: SITE_URL,
    },
  };

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

  return (
    <>
      <Helmet>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content="Wakili Legal Editorial Team" />
        <meta name="publisher" content="Wakili" />
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {showContentModules && <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>}
      </Helmet>

      {children}

      {showContentModules && (
        <section className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Editorial Standards</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                This page is reviewed by the Wakili Legal Editorial Team and updated for legal relevance in Kenya.
                Content is educational and does not replace legal advice for your specific case.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Last updated: {new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Related Legal Guides</h3>
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {relatedGuides.map((guide) => (
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
