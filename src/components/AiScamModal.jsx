import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, X, Sparkles, PartyPopper } from 'lucide-react';

export default function AiScamModal({ product, onClose }) {
  if (!product) return null;
  const { aiScamReport, vendorName, title } = product;
  const isHighTrust = aiScamReport.trustScore >= 90;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-pop animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-paper-mist p-2 text-ink-soft hover:bg-paper-sunk transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">Trust & safety report</h3>
            <p className="text-xs text-ink-faint">Generated from verification checks and buyer feedback</p>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-paper-mist p-3 text-xs">
          <p className="text-ink-faint">Item</p>
          <p className="truncate font-medium text-ink">{title}</p>
          <p className="text-ink-soft">Vendor: {vendorName}</p>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-lg border border-line p-4">
          <div>
            <span className="block text-xs text-ink-faint">AI trust score</span>
            <span className="font-display text-2xl font-semibold text-ink">{aiScamReport.trustScore} / 100</span>
          </div>
          <span className={isHighTrust ? 'badge-moss' : 'badge-gold'}>
            <ShieldCheck size={14} className="mr-0.5" /> {aiScamReport.status}
          </span>
        </div>

        <div className="mb-4 space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-medium text-moss-700">
            <CheckCircle size={14} /> Verified positives ({aiScamReport.positiveFlags.length})
          </h4>
          <ul className="space-y-1.5">
            {aiScamReport.positiveFlags.map((flag, idx) => (
              <li key={idx} className="rounded bg-moss-50 p-2 text-xs text-ink-soft">{flag}</li>
            ))}
          </ul>
        </div>

        {aiScamReport.negativeFlags.length > 0 ? (
          <div className="mb-6 space-y-2">
            <h4 className="flex items-center gap-1.5 text-xs font-medium text-gold-700">
              <AlertTriangle size={14} /> Reported cautions ({aiScamReport.negativeFlags.length})
            </h4>
            <ul className="space-y-1.5">
              {aiScamReport.negativeFlags.map((flag, idx) => (
                <li key={idx} className="rounded bg-gold-50 p-2 text-xs text-ink-soft">{flag}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2 rounded bg-moss-50 p-2.5 text-xs text-moss-700">
            <PartyPopper size={14} /> No negative reports on file for this vendor.
          </div>
        )}

        <button type="button" onClick={onClose} className="btn-primary w-full">
          Back to marketplace
        </button>
      </div>
    </div>
  );
}
