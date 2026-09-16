import React from 'react';
import { Flame, ShoppingCart } from 'lucide-react';
import Price from './ui/Price';

export default function HeroSection({
  flashDrops,
  flashDropSlideIndex,
  setFlashDropSlideIndex,
  onAddToCart,
}) {
  if (!flashDrops || flashDrops.length === 0) return null;
  const activeFlashItem = flashDrops[flashDropSlideIndex] || flashDrops[0];

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
          <Flame size={18} className="text-gold" /> Flash price drops
        </h2>
        <span className="badge-gold">Rotating hourly</span>
      </div>

      {activeFlashItem && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-paper-sunk sm:w-32">
            <img
              src={activeFlashItem.image}
              alt={activeFlashItem.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              {activeFlashItem.category.replace('_', ' ')} · {activeFlashItem.vendorName}
            </span>
            <h4 className="truncate text-sm font-medium text-ink">{activeFlashItem.title}</h4>
            <Price amount={activeFlashItem.salePrice} originalAmount={activeFlashItem.originalPrice} size="md" />
            <button
              type="button"
              onClick={() => onAddToCart(activeFlashItem)}
              className="btn-primary btn-sm mt-1"
            >
              <ShoppingCart size={14} /> Claim deal
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5">
        {flashDrops.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Show deal ${idx + 1}`}
            onClick={() => setFlashDropSlideIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              flashDropSlideIndex === idx ? 'w-6 bg-gold' : 'w-1.5 bg-paper-sunk'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
