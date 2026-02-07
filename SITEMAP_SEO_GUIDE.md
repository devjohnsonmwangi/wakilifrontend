# Sitemap & SEO Configuration Guide

## Overview

This document outlines the sitemap structure and SEO configuration for the Wakili Legal Services website. The sitemap is automatically generated to help Google index all legal content pages.

---

## Sitemap Details

### File Location
- **XML Sitemap:** `/public/sitemap.xml`
- **Robots.txt:** `/public/robots.txt`

### Total Pages in Sitemap: 28

#### High Priority Pages (Priority 1.0 - 0.95) - 7 Pages
These are the most recently created and SEO-optimized pages:

1. **Occupational Health & Safety (OSHA) in Kenya** - Priority 1.0
   - URL: `/occupational-health-safety-kenya`
   - Last Modified: 2026-02-07
   - Change Frequency: Weekly
   - Covers: OSHA regulations, employer obligations, employee rights, workplace hazards

2. **Termination, Redundancy & Severance in Kenya** - Priority 1.0
   - URL: `/termination-redundancy-severance-kenya`
   - Last Modified: 2026-02-07
   - Change Frequency: Weekly
   - Covers: Termination procedures, redundancy rights, severance calculations

3. **Labour Dispute Resolution in Kenya** - Priority 1.0
   - URL: `/labour-dispute-resolution-kenya`
   - Last Modified: 2026-02-07
   - Change Frequency: Weekly
   - Covers: Dispute resolution, mediation, arbitration, court procedures

4. **Employment Contracts in Kenya** - Priority 0.95
   - URL: `/employment-contracts-kenya`
   - Last Modified: 2026-02-07
   - Change Frequency: Weekly
   - Covers: Contract templates, clauses, drafting guide

5. **Kenya Employment & Labour Laws** - Priority 0.95
   - URL: `/kenya-employment-labour-laws`
   - Last Modified: 2026-02-07
   - Change Frequency: Weekly
   - Covers: Employee rights, employer obligations, legal framework

6. **Business Tax Obligations in Kenya** - Priority 0.95
   - URL: `/business-tax-obligations-kenya`
   - Last Modified: 2026-02-07
   - Change Frequency: Weekly
   - Covers: VAT, PAYE, income tax, turnover tax

#### Medium Priority Pages (Priority 0.90 - 0.85) - 8 Pages
Business registration and compliance pages:

7. **Company Annual Returns and CR12 Filing** - Priority 0.90
8. **KRA PIN and Tax Registration** - Priority 0.90
9. **Business Permits and Licenses** - Priority 0.90
10. **NGO/CBO/Society Registration** - Priority 0.85
11. **Partnership and LLP Registration** - Priority 0.85
12. **Business Deregistration and Company Closure** - Priority 0.85
13. **CR12 Annual Returns & Filing** - Priority 0.85
14. **Limited Company Registration** - Priority 0.85

#### Standard Priority Pages (Priority 0.80) - 10 Pages
Foundational legal pages:

15. **Sole Proprietor Registration** - Priority 0.85
16. **Candidate Nomination & Requirements** - Priority 0.80
17. **Elections, IEBC & Voter Registration** - Priority 0.80
18. **Leasehold Property Law** - Priority 0.80
19. **Land Disputes & Adverse Possession** - Priority 0.80
20. **Land Ownership & Transfer** - Priority 0.80
21. **Succession, Wills & Probate** - Priority 0.80
22. **Child Law & Protection** - Priority 0.80
23. **Divorce & Separation** - Priority 0.80
24. **Family Law** - Priority 0.80

#### Lower Priority Pages (Priority 0.70 - 0.50) - 3 Pages
Utility pages:

25. **About Page** - Priority 0.70
26. **Contact Page** - Priority 0.70
27. **Privacy Policy** - Priority 0.50
28. **Terms of Service** - Priority 0.50

---

## SEO Configuration

### Robots.txt Rules

**Allowed for all search engines:**
- `/` - Entire site publicly crawlable

**Disallowed:**
- `/admin/` - Admin panel
- `/private/` - Private content
- `/dashboard/` - User dashboard
- `/*.pdf$` - PDF files (optional)
- `/downloads/` - Download directory

**Crawl Delays:**
- General: 1 second between requests
- Googlebot: 0 seconds (no delay for Google)
- Bingbot: 1 second delay

**Blocked Bots:**
- MJ12bot (Majestic bot)
- AhrefsBot (Ahrefs)
- SemrushBot (Semrush)

---

## Page Content Structure

### Each Legal Page Includes:

1. **SEO Metadata**
   - Title (≤ 60 characters)
   - Meta description (150-160 characters)
   - Canonical URL
   - OpenGraph tags
   - Twitter Card tags
   - Robots meta directive

2. **JSON-LD Structured Data**
   - Organization schema
   - BreadcrumbList
   - FAQPage (or HowTo schema)
   - Specific page schema

3. **Content**
   - H1 headline (unique per page)
   - 10-12 H2 sections
   - 15-17 comprehensive FAQs
   - Multiple data tables
   - Internal cross-links
   - Professional styling

4. **Internal Linking**
   - 5-6 related pages per content piece
   - Contextual link placement
   - Descriptive anchor text

---

## Sitemap Update Strategy

### Automatic Updates
- Update `lastmod` date when page content changes
- Update `changefreq` based on content update frequency
- Add new pages with `priority 1.0` initially

### Manual Updates
When adding new content pages:

1. Add new `<url>` entry to `sitemap.xml`
2. Include `lastmod` (YYYY-MM-DD format)
3. Set appropriate `changefreq`:
   - `weekly` - For regularly updated content
   - `monthly` - For periodically updated content
   - `yearly` - For static content
   - `never` - For archived content

4. Set appropriate `priority` (0.0-1.0):
   - `1.0` - Homepage and newest content
   - `0.95` - Major SEO-focused pages
   - `0.90` - Important business pages
   - `0.85` - Standard pages
   - `0.80` - Foundational content
   - `0.70` - Utility pages
   - `0.50` - Archival/policy pages

---

## Google Search Console Setup

### Required Steps:

1. **Verify Site Ownership**
   - Add domain to Google Search Console
   - Use DNS record, HTML file, or meta tag verification

2. **Submit Sitemap**
   - Navigate to Sitemaps section
   - Submit: `https://yoursite.com/sitemap.xml`
   - Google will crawl within 24 hours typically

3. **Monitor Crawl Statistics**
   - Check "Coverage" report
   - Review any "Error" or "Warning" pages
   - Monitor crawl requests

4. **Optimize Crawl Budget**
   - Remove non-essential pages from sitemap
   - Consolidate duplicate content
   - Fix broken links (404 errors)

---

## Bing Webmaster Tools Setup

### Required Steps:

1. **Verify Site with Bing**
   - Sign in to Bing Webmaster Tools
   - Add site URL
   - Verify ownership

2. **Submit Sitemap**
   - Submit: `https://yoursite.com/sitemap.xml`
   - Bing crawls 24-48 hours later

3. **Monitor Index Status**
   - Check "Index Status" report
   - Review "URL Issues"
   - Monitor crawl requests

---

## Mobile Optimization

All pages include:
- Responsive design (mobile-first)
- Mobile-friendly navigation
- Touch-friendly buttons and links
- Optimized images
- Mobile-friendly fonts

**Mobile Testing:**
- Google Mobile-Friendly Test
- Bing Mobile Friendliness Test
- Chrome DevTools device emulation

---

## Performance Metrics

### Build Statistics (as of 2026-02-07)
- **Total Pages:** 20 major content pages
- **Total Routes:** 73 (including internal pages)
- **Build Time:** ~1m 20s
- **PWA Precache Size:** ~8.7 MB
- **Sitemap Size:** ~28 URLs

### Target Metrics
- Lighthouse Score: 90+
- Page Load Time: < 2 seconds
- Core Web Vitals: All green

---

## Content Calendar for Future Pages

### Recommended Next Phases:

**Phase 33: Workplace Harassment & Discrimination**
- Keywords: Workplace harassment Kenya, discrimination at work, sexual harassment
- Priority: 1.0
- Internal links to: Employment laws, Labour dispute resolution, Termination guide

**Phase 34: Trade Union Rights & Collective Bargaining**
- Keywords: Trade union Kenya, collective bargaining, strike rights
- Priority: 1.0
- Internal links to: Labour laws, Employment contracts, Dispute resolution

**Phase 35: Special Employment Categories**
- Keywords: Domestic workers Kenya, agricultural workers, security guards
- Priority: 0.95
- Internal links to: Employment laws, Safety, Termination

**Phase 36: Employee Benefits & Entitlements**
- Keywords: Leave entitlements Kenya, benefits, allowances
- Priority: 0.95
- Internal links to: Employment contracts, Labour laws, Termination

**Phase 37: Workplace Health & Medical Benefits**
- Keywords: NHIF Kenya, health insurance, medical benefits
- Priority: 0.90
- Internal links to: Employment laws, Safety, Benefits

---

## Maintenance Checklist

### Monthly:
- [ ] Check Google Search Console for errors
- [ ] Review crawl statistics
- [ ] Monitor top-performing pages
- [ ] Check for broken links (404s)

### Quarterly:
- [ ] Update `lastmod` dates for modified pages
- [ ] Review and update `changefreq` values
- [ ] Audit internal link structure
- [ ] Check mobile friendliness

### Annually:
- [ ] Full sitemap audit
- [ ] Review and adjust priorities
- [ ] Analyze page performance data
- [ ] Update robots.txt if needed
- [ ] Refresh meta descriptions if needed

---

## Contact & Support

For questions about:
- **Sitemap structure:** Review this guide
- **SEO optimization:** Consult Google SEO Starter Guide
- **XML Sitemap spec:** See sitemaps.org
- **Robots.txt help:** Review robotstxt.org

---

**Last Updated:** 2026-02-07  
**Next Review:** 2026-05-07
