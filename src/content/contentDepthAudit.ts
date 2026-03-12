/**
 * Content Depth Audit Utility
 *
 * Scores every public content route against the quality registry and returns
 * a ranked list from weakest to strongest, so you know exactly which pages
 * need more explicit registry entries or real-page content work.
 *
 * Scoring rubric (max 7 pts):
 *  +2  Explicit routeOverrides entry  (custom title + description)
 *  +2  Explicit routeDeepContent entry  (who/checklist/mistakes)
 *  +1  Explicit routeEditorialProfiles entry  (author + reviewer)
 *  +1  Explicit routeEvidenceNotes entry  (evidence/source notes)
 *  +0.5  Explicit routeContextualLinks entry  (hand-picked internal links)
 *  +0.5  Route appears in at least one category's categoryContextualLinks
 *         (meaning other pages link TO it — a rough inbound-link signal)
 */

export interface RouteAuditResult {
  pathname: string;
  score: number;
  maxScore: number;
  tier: 'strong' | 'medium' | 'weak' | 'thin';
  signals: {
    hasOverride: boolean;
    hasDeepContent: boolean;
    hasEditorialProfile: boolean;
    hasEvidenceNotes: boolean;
    hasContextualLinkOverride: boolean;
    isLinkedByOthers: boolean;
  };
  recommendations: string[];
}

// ─── All public content routes (mirrors the router in main.tsx) ───────────────
// Auth + utility routes are excluded — they don't need content depth.
const PUBLIC_CONTENT_ROUTES: string[] = [
  '/',
  '/howitworks',
  '/services',
  '/about',
  '/updates',
  '/contactus',
  '/family-law-divorce-kenya',
  '/divorce-in-kenya',
  '/divorce-law-in-kenya',
  '/child-law-kenya',
  '/succession-inheritance-law-kenya',
  '/how-to-write-a-will-kenya',
  '/letters-of-administration-probate-kenya',
  '/land-transfer-after-death',
  '/land-ownership-title-deed-verification-kenya',
  '/land-transfer-process-kenya',
  '/how-to-buy-land-safely-kenya',
  '/land-disputes-kenya',
  '/adverse-possession-kenya',
  '/leasehold-freehold-kenya',
  '/lost-title-deed-replacement-kenya',
  '/land-rates-property-taxes-kenya',
  '/subdivision-survey-process-kenya',
  '/planning-permission-zoning-laws-kenya',
  '/understanding-iebc-kenya',
  '/how-to-register-as-a-voter-kenya',
  '/how-to-check-voter-status-kenya',
  '/elections-in-kenya',
  '/types-of-elections-kenya',
  '/presidential-parliamentary-county-elections-kenya',
  '/election-results-declaration-kenya',
  '/political-parties-registration-kenya',
  '/election-petitions-disputes-kenya',
  '/citizens-rights-duties-elections-kenya',
  '/iebc-forms-downloads-kenya',
  '/iebc-forms-downloads',
  '/become-candidate-kenya',
  '/election-offences-penalties-kenya',
  '/iebc-contacts-offices-kenya',
  '/how-to-register-business-kenya',
  '/business-name-search-kenya',
  '/sole-proprietorship-registration-kenya',
  '/limited-company-registration-kenya',
  '/company-cr12-and-search-kenya',
  '/company-annual-returns-kenya',
  '/kra-pin-for-business-kenya',
  '/closing-or-deregistering-company-kenya',
  '/partnership-llp-registration-kenya',
  '/ngo-cbo-society-registration-kenya',
  '/business-permits-licenses-kenya',
  '/kra-pin-and-tax-registration-kenya',
  '/company-annual-returns-and-filing-kenya',
  '/business-tax-obligations-kenya',
  '/kenya-employment-labour-laws',
  '/employment-contracts-kenya',
  '/labour-dispute-resolution-kenya',
  '/termination-redundancy-severance-kenya',
  '/occupational-health-safety-kenya',
];

// ─── Registry snapshot (mirrored keys only — no runtime import needed) ────────
// These sets are kept in sync manually or via CI. They intentionally repeat
// the key names from pageQualityRegistry.ts so this file is dependency-free
// and can be tree-shaken out of production builds when not used.

const ROUTE_OVERRIDES_KEYS = new Set([
  '/',
  '/howitworks',
  '/about',
  '/updates',
  '/family-law-divorce-kenya',
  '/land-disputes-kenya',
  '/how-to-register-business-kenya',
  '/elections-in-kenya',
  '/kenya-employment-labour-laws',
]);

const ROUTE_DEEP_CONTENT_KEYS = new Set([
  '/howitworks',
  '/services',
  '/about',
  '/updates',
  '/family-law-divorce-kenya',
  '/divorce-in-kenya',
  '/child-law-kenya',
  '/succession-inheritance-law-kenya',
  '/land-disputes-kenya',
  '/land-ownership-title-deed-verification-kenya',
  '/how-to-buy-land-safely-kenya',
  '/how-to-register-business-kenya',
  '/business-name-search-kenya',
  '/limited-company-registration-kenya',
  '/business-tax-obligations-kenya',
  '/elections-in-kenya',
  '/how-to-register-as-a-voter-kenya',
  '/election-results-declaration-kenya',
  '/kenya-employment-labour-laws',
  '/termination-redundancy-severance-kenya',
  '/divorce-law-in-kenya',
  '/letters-of-administration-probate-kenya',
  '/land-transfer-after-death',
  '/land-transfer-process-kenya',
  '/adverse-possession-kenya',
  '/leasehold-freehold-kenya',
  '/lost-title-deed-replacement-kenya',
  '/types-of-elections-kenya',
  '/political-parties-registration-kenya',
  '/election-petitions-disputes-kenya',
  '/citizens-rights-duties-elections-kenya',
  '/become-candidate-kenya',
  '/iebc-contacts-offices-kenya',
  '/sole-proprietorship-registration-kenya',
  '/company-cr12-and-search-kenya',
  '/company-annual-returns-kenya',
  '/employment-contracts-kenya',
  '/labour-dispute-resolution-kenya',
  '/occupational-health-safety-kenya',
]);

const ROUTE_EDITORIAL_PROFILE_KEYS = new Set([
  '/family-law-divorce-kenya',
  '/land-disputes-kenya',
  '/how-to-register-business-kenya',
  '/elections-in-kenya',
  '/kenya-employment-labour-laws',
]);

const ROUTE_EVIDENCE_NOTES_KEYS = new Set([
  '/family-law-divorce-kenya',
  '/land-disputes-kenya',
  '/how-to-register-business-kenya',
  '/elections-in-kenya',
  '/kenya-employment-labour-laws',
]);

const ROUTE_CONTEXTUAL_LINK_OVERRIDE_KEYS = new Set(['/', '/updates']);

// Routes that appear as destinations in category contextual link lists
const LINKED_BY_OTHERS = new Set([
  '/family-law-divorce-kenya',
  '/divorce-in-kenya',
  '/child-law-kenya',
  '/succession-inheritance-law-kenya',
  '/land-disputes-kenya',
  '/how-to-buy-land-safely-kenya',
  '/land-ownership-title-deed-verification-kenya',
  '/land-transfer-process-kenya',
  '/how-to-register-business-kenya',
  '/business-name-search-kenya',
  '/limited-company-registration-kenya',
  '/company-annual-returns-kenya',
  '/elections-in-kenya',
  '/how-to-register-as-a-voter-kenya',
  '/election-petitions-disputes-kenya',
  '/political-parties-registration-kenya',
  '/kenya-employment-labour-laws',
  '/employment-contracts-kenya',
  '/termination-redundancy-severance-kenya',
  '/labour-dispute-resolution-kenya',
]);

// ─── Scoring ──────────────────────────────────────────────────────────────────

const MAX_SCORE = 7;

function scoreRoute(pathname: string): RouteAuditResult {
  const signals = {
    hasOverride: ROUTE_OVERRIDES_KEYS.has(pathname),
    hasDeepContent: ROUTE_DEEP_CONTENT_KEYS.has(pathname),
    hasEditorialProfile: ROUTE_EDITORIAL_PROFILE_KEYS.has(pathname),
    hasEvidenceNotes: ROUTE_EVIDENCE_NOTES_KEYS.has(pathname),
    hasContextualLinkOverride: ROUTE_CONTEXTUAL_LINK_OVERRIDE_KEYS.has(pathname),
    isLinkedByOthers: LINKED_BY_OTHERS.has(pathname),
  };

  const score =
    (signals.hasOverride ? 2 : 0) +
    (signals.hasDeepContent ? 2 : 0) +
    (signals.hasEditorialProfile ? 1 : 0) +
    (signals.hasEvidenceNotes ? 1 : 0) +
    (signals.hasContextualLinkOverride ? 0.5 : 0) +
    (signals.isLinkedByOthers ? 0.5 : 0);

  const pct = score / MAX_SCORE;
  const tier: RouteAuditResult['tier'] =
    pct >= 0.8 ? 'strong' : pct >= 0.55 ? 'medium' : pct >= 0.3 ? 'weak' : 'thin';

  const recommendations: string[] = [];
  if (!signals.hasOverride)
    recommendations.push('Add a routeOverrides entry (custom title + description).');
  if (!signals.hasDeepContent)
    recommendations.push('Add a routeDeepContent entry (who/checklist/mistakes).');
  if (!signals.hasEditorialProfile)
    recommendations.push('Add a routeEditorialProfiles entry (author + reviewer).');
  if (!signals.hasEvidenceNotes)
    recommendations.push('Add a routeEvidenceNotes entry (evidence + source notes).');
  if (!signals.hasContextualLinkOverride)
    recommendations.push('Consider a routeContextualLinks override for hand-picked related links.');
  if (!signals.isLinkedByOthers)
    recommendations.push('Add this URL as a contextual link destination in a relevant category.');

  return { pathname, score, maxScore: MAX_SCORE, tier, signals, recommendations };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Returns all routes scored weakest-first. */
export function runContentDepthAudit(): RouteAuditResult[] {
  return PUBLIC_CONTENT_ROUTES.map(scoreRoute).sort((a, b) => a.score - b.score);
}

/** Returns only routes below the given score threshold (default 4). */
export function getWeakRoutes(threshold = 4): RouteAuditResult[] {
  return runContentDepthAudit().filter((r) => r.score < threshold);
}

/** Returns a plain-text summary suitable for console output. */
export function printAuditSummary(): string {
  const results = runContentDepthAudit();
  const lines: string[] = [
    '╔══════════════════════════════════════════════════════════════════╗',
    '║          WAKILI CONTENT DEPTH AUDIT  (weakest → strongest)      ║',
    '╠══════════════════════════════════════════════════════════════════╣',
    `║  Total routes audited: ${String(results.length).padEnd(43)}║`,
    `║  Strong (≥80%) : ${String(results.filter((r) => r.tier === 'strong').length).padEnd(48)}║`,
    `║  Medium (55-79%): ${String(results.filter((r) => r.tier === 'medium').length).padEnd(47)}║`,
    `║  Weak  (30-54%) : ${String(results.filter((r) => r.tier === 'weak').length).padEnd(47)}║`,
    `║  Thin  (<30%)   : ${String(results.filter((r) => r.tier === 'thin').length).padEnd(47)}║`,
    '╠══════════════════════════════════════════════════════════════════╣',
  ];

  for (const r of results) {
    const bar = '█'.repeat(Math.round((r.score / r.maxScore) * 20)).padEnd(20, '░');
    const label = `${r.tier.toUpperCase().padEnd(6)} ${bar} ${r.score.toFixed(1)}/${r.maxScore}`;
    lines.push(`║  ${r.pathname.padEnd(50)} ${label} ║`.substring(0, 68) + ' ║');
  }

  lines.push('╚══════════════════════════════════════════════════════════════════╝');
  return lines.join('\n');
}
