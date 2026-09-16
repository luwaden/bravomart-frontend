import React from 'react';

/** Formats a Naira amount consistently everywhere prices are shown. */
export function formatNaira(amount) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—';
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}

/**
 * The one place that renders a price + optional strikethrough original +
 * discount badge, so product cards, product detail, cart, and checkout all
 * look identical instead of drifting apart.
 */
export default function Price({ amount, originalAmount, size = 'md', className = '' }) {
  const hasDiscount = originalAmount && originalAmount > amount;
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-baseline gap-2 flex-wrap ${className}`}>
      <span className={`font-display font-semibold text-ink ${sizes[size]}`}>
        {formatNaira(amount)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-ink-faint line-through text-xs">{formatNaira(originalAmount)}</span>
          <span className="badge-gold">
            −{Math.round(((originalAmount - amount) / originalAmount) * 100)}%
          </span>
        </>
      )}
    </div>
  );
}
