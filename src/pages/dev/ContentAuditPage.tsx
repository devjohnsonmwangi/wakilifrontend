/**
 * ContentAuditPage — DEV ONLY (/dev/content-audit)
 *
 * Not indexed by search engines (noindex meta is injected by PublicQualityLayout
 * stub below). Shows a live table of all public routes scored by content depth.
 *
 * Access in development: http://localhost:5173/dev/content-audit
 */

import React, { useMemo, useState } from 'react';
import { runContentDepthAudit, RouteAuditResult } from '../../content/contentDepthAudit';

const TIER_COLORS: Record<RouteAuditResult['tier'], string> = {
  strong: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  weak: 'bg-orange-100 text-orange-800 border-orange-300',
  thin: 'bg-red-100 text-red-800 border-red-300',
};

const TIER_BADGE: Record<RouteAuditResult['tier'], string> = {
  strong: 'bg-green-600 text-white',
  medium: 'bg-yellow-500 text-white',
  weak: 'bg-orange-500 text-white',
  thin: 'bg-red-600 text-white',
};

const SIGNAL_LABELS: Array<{ key: keyof RouteAuditResult['signals']; label: string; pts: string }> =
  [
    { key: 'hasOverride', label: 'routeOverrides', pts: '+2' },
    { key: 'hasDeepContent', label: 'routeDeepContent', pts: '+2' },
    { key: 'hasEditorialProfile', label: 'routeEditorialProfiles', pts: '+1' },
    { key: 'hasEvidenceNotes', label: 'routeEvidenceNotes', pts: '+1' },
    { key: 'hasContextualLinkOverride', label: 'routeContextualLinks override', pts: '+0.5' },
    { key: 'isLinkedByOthers', label: 'Linked by other pages', pts: '+0.5' },
  ];

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color =
    pct >= 80
      ? 'bg-green-500'
      : pct >= 55
      ? 'bg-yellow-400'
      : pct >= 30
      ? 'bg-orange-400'
      : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-32 bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono font-semibold">
        {score}/{max}
      </span>
    </div>
  );
}

function Signal({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400 line-through'
      }`}
    >
      {active ? '✓' : '✗'} {label}
    </span>
  );
}

type SortKey = 'score' | 'pathname' | 'tier';
type FilterTier = 'all' | RouteAuditResult['tier'];

export default function ContentAuditPage() {
  const results = useMemo(() => runContentDepthAudit(), []);
  const [sort, setSort] = useState<SortKey>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterTier, setFilterTier] = useState<FilterTier>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const tierOrder: Record<RouteAuditResult['tier'], number> = {
    thin: 0,
    weak: 1,
    medium: 2,
    strong: 3,
  };

  const filtered = results.filter((r) => filterTier === 'all' || r.tier === filterTier);

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sort === 'score') cmp = a.score - b.score;
    else if (sort === 'pathname') cmp = a.pathname.localeCompare(b.pathname);
    else if (sort === 'tier') cmp = tierOrder[a.tier] - tierOrder[b.tier];
    return sortDir === 'asc' ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sort === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSort(key);
      setSortDir('asc');
    }
  }

  const counts = {
    strong: results.filter((r) => r.tier === 'strong').length,
    medium: results.filter((r) => r.tier === 'medium').length,
    weak: results.filter((r) => r.tier === 'weak').length,
    thin: results.filter((r) => r.tier === 'thin').length,
  };

  const avgScore = results.reduce((s, r) => s + r.score, 0) / results.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-4 py-2 mb-4 text-sm text-yellow-800 font-medium">
          ⚠ DEV-ONLY page — this route is not indexed and not visible in production builds.
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Content Depth Audit</h1>
        <p className="text-gray-500 text-sm mb-4">
          Scores all public routes against the quality registry. Fix <strong>Thin</strong> and{' '}
          <strong>Weak</strong> routes first to improve AdSense content quality signals.
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {(
            [
              { label: 'Total Routes', value: results.length, cls: 'bg-white border-gray-200' },
              { label: 'Avg Score', value: `${avgScore.toFixed(1)}/7`, cls: 'bg-white border-gray-200' },
              { label: 'Strong', value: counts.strong, cls: 'bg-green-50 border-green-300' },
              { label: 'Medium', value: counts.medium, cls: 'bg-yellow-50 border-yellow-300' },
              { label: 'Weak', value: counts.weak, cls: 'bg-orange-50 border-orange-300' },
            ] as { label: string; value: string | number; cls: string }[]
          ).map((c) => (
            <div key={c.label} className={`rounded-lg border p-3 text-center ${c.cls}`}>
              <div className="text-xl font-bold">{c.value}</div>
              <div className="text-xs text-gray-500">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Thin alert */}
        {counts.thin > 0 && (
          <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3 mb-4">
            <p className="text-red-800 font-semibold text-sm">
              🚨 {counts.thin} route{counts.thin > 1 ? 's' : ''} are THIN (score &lt; 30%). These
              are the highest priority for AdSense content quality improvement.
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter:</span>
          {(['all', 'thin', 'weak', 'medium', 'strong'] as FilterTier[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                filterTier === t
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }`}
            >
              {t === 'all' ? `All (${results.length})` : `${t.charAt(0).toUpperCase() + t.slice(1)} (${counts[t as RouteAuditResult['tier']]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => toggleSort('pathname')}
                >
                  Route {sort === 'pathname' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => toggleSort('tier')}
                >
                  Tier {sort === 'tier' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                  onClick={() => toggleSort('score')}
                >
                  Score {sort === 'score' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Signals</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((r) => (
                <React.Fragment key={r.pathname}>
                  <tr
                    className={`transition-colors ${
                      expandedRow === r.pathname ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } ${TIER_COLORS[r.tier]}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium">{r.pathname}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                          TIER_BADGE[r.tier]
                        }`}
                      >
                        {r.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBar score={r.score} max={r.maxScore} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {SIGNAL_LABELS.map((s) => (
                          <Signal
                            key={s.key}
                            active={r.signals[s.key]}
                            label={s.pts}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          setExpandedRow(expandedRow === r.pathname ? null : r.pathname)
                        }
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {expandedRow === r.pathname ? 'Hide' : 'Expand'}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === r.pathname && (
                    <tr>
                      <td colSpan={5} className="bg-blue-50 px-6 py-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-xs uppercase text-gray-500 mb-2">
                              Quality Signals
                            </h4>
                            <div className="space-y-1">
                              {SIGNAL_LABELS.map((s) => (
                                <div key={s.key} className="flex items-center gap-2 text-xs">
                                  <span
                                    className={`font-bold ${
                                      r.signals[s.key] ? 'text-green-600' : 'text-red-500'
                                    }`}
                                  >
                                    {r.signals[s.key] ? '✓' : '✗'}
                                  </span>
                                  <span className="text-gray-600">
                                    {s.label}{' '}
                                    <span className="text-gray-400">({s.pts} pts)</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-xs uppercase text-gray-500 mb-2">
                              Recommendations
                            </h4>
                            {r.recommendations.length === 0 ? (
                              <p className="text-xs text-green-700">
                                ✓ All signals present — this route is fully optimised.
                              </p>
                            ) : (
                              <ul className="space-y-1">
                                {r.recommendations.map((rec, i) => (
                                  <li key={i} className="text-xs text-orange-800 flex gap-1">
                                    <span>→</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
          {SIGNAL_LABELS.map((s) => (
            <span key={s.key}>
              <strong>{s.pts}</strong> — {s.label}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          File: <code>src/content/contentDepthAudit.ts</code> — update the Sets there when you add
          new registry entries.
        </p>
      </div>
    </div>
  );
}
