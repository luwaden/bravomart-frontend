import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

/**
 * Renders a vendor's AI trust score as a small, quiet seal rather than a
 * loud banner — trust is meant to be a constant ambient signal across the
 * whole catalog (garri to excavators alike), not a decoration on top of it.
 *
 * `report` matches the `aiScamReport` shape already used in mockData.js:
 * { trustScore, status, positiveFlags: [], negativeFlags: [] }
 */
export default function TrustSeal({ report, size = 'sm' }) {
  if (!report) return null;
  const { trustScore, status } = report;

  const tier =
    trustScore >= 90 ? 'moss' : trustScore >= 70 ? 'gold' : 'clay';

  const Icon = tier === 'moss' ? ShieldCheck : tier === 'gold' ? ShieldQuestion : ShieldAlert;

  const tierClasses = {
    moss: 'bg-moss-50 text-moss-700 border-moss-200',
    gold: 'bg-gold-50 text-gold-700 border-gold-200',
    clay: 'bg-clay-50 text-clay-600 border-clay-100',
  };

  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium leading-none ${tierClasses[tier]}`}
      title={status}
    >
      <Icon size={iconSize} strokeWidth={2.25} />
      <span>{trustScore}</span>
    </div>
  );
}
