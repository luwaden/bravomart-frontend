import React, { useState } from 'react';
import {
  Sparkles, TrendingDown, Users, CheckCircle2, ShoppingCart, ChevronLeft,
  ChevronRight, Building2, Zap, ShieldCheck, X, MapPin, Star, Store,
} from 'lucide-react';
import Price, { formatNaira } from './ui/Price';

const VERIFIED_MERCHANTS = [
  {
    id: 'm1',
    name: 'Bello Agro & Foods',
    category: 'Agricultural produce',
    rating: 4.9,
    reviewsCount: 312,
    location: 'Mile 12 Market, Lagos',
    feedbackRate: '98%',
    escrowRating: '100%',
    icon: Building2,
    description: 'Direct farm supplier specializing in grains, tubers, and bulk foodstuff with guaranteed fresh delivery.',
    products: [
      { id: 'p1', title: 'Ijebu Garri (50kg Bag)', price: 48500, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80' },
      { id: 'p2', title: 'Royal Stallion Rice (50kg)', price: 72000, img: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=300&q=80' },
      { id: 'p3', title: 'Refined Palm Oil (25 Liters)', price: 34000, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80' },
    ],
  },
  {
    id: 'm2',
    name: 'Solar Power Direct',
    category: 'Renewable energy',
    rating: 5.0,
    reviewsCount: 184,
    location: 'Alaba Int. Market, Lagos',
    feedbackRate: '100%',
    escrowRating: '100%',
    icon: Zap,
    description: 'Certified distributor of Tier-1 solar panels, hybrid inverters, and lithium battery storage with warranty.',
    products: [
      { id: 'p4', title: '5kVA Pure Sine Inverter', price: 320000, img: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&q=80' },
      { id: 'p5', title: '550W Monocrystalline Panel', price: 85000, img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=300&q=80' },
    ],
  },
];

const PRICE_INDEX = [
  { title: 'Ijebu Garri (50kg)', place: 'Lagos main market', price: 48500, changePct: -2.4 },
  { title: '5kVA Solar Inverter', place: 'Alaba International', price: 320000, changePct: -5.0 },
];

export default function RightSidebar({ products = [], activeSlideIndex = 0, setActiveSlideIndex, onAddToCart }) {
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const activeSlideProduct = products[activeSlideIndex] || products[0];
  const maxIdx = Math.min(products.length - 1, 4);

  const handlePrevSlide = () => setActiveSlideIndex?.(activeSlideIndex === 0 ? maxIdx : activeSlideIndex - 1);
  const handleNextSlide = () => setActiveSlideIndex?.(activeSlideIndex >= maxIdx ? 0 : activeSlideIndex + 1);

  return (
    <>
      <aside className="space-y-4">
        {/* New arrivals */}
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between border-b border-line pb-2">
            <h3 className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
              <Sparkles size={14} className="text-gold" /> New arrivals
            </h3>
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={handlePrevSlide} className="rounded p-1 text-ink-faint hover:bg-paper-mist hover:text-ink cursor-pointer">
                <ChevronLeft size={14} />
              </button>
              <button type="button" onClick={handleNextSlide} className="rounded p-1 text-ink-faint hover:bg-paper-mist hover:text-ink cursor-pointer">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {activeSlideProduct && (
            <div className="space-y-2">
              <div className="relative h-32 overflow-hidden rounded bg-paper-sunk">
                <img src={activeSlideProduct.image || activeSlideProduct.imgUrl} alt={activeSlideProduct.title} className="h-full w-full object-cover" />
              </div>
              <p className="truncate text-xs font-medium text-ink">{activeSlideProduct.title}</p>
              <div className="flex items-center justify-between pt-0.5">
                <Price amount={activeSlideProduct.salePrice || activeSlideProduct.price} size="sm" />
                <button
                  type="button"
                  onClick={() => onAddToCart?.(activeSlideProduct)}
                  className="btn-primary btn-sm"
                >
                  <ShoppingCart size={12} /> View
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-center gap-1">
            {products.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlideIndex?.(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${activeSlideIndex === idx ? 'w-4 bg-moss' : 'w-1.5 bg-paper-sunk'}`}
              />
            ))}
          </div>
        </div>

        {/* Price index */}
        <div className="card p-4 space-y-2">
          <h3 className="flex items-center gap-1.5 border-b border-line pb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            <TrendingDown size={14} className="text-moss" /> Price index
          </h3>
          {PRICE_INDEX.map((row) => (
            <div key={row.title} className="flex items-center justify-between rounded bg-paper-mist p-2.5">
              <div>
                <p className="text-xs font-medium text-ink">{row.title}</p>
                <p className="text-[11px] text-ink-faint">{row.place}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-ink">{formatNaira(row.price)}</p>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-moss-600">
                  <TrendingDown size={10} /> {row.changePct}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Verified merchants */}
        <div className="card p-4 space-y-1">
          <h3 className="flex items-center gap-1.5 border-b border-line pb-2 mb-1 text-xs font-medium uppercase tracking-wide text-ink-faint">
            <Users size={14} /> Top verified merchants
          </h3>
          {VERIFIED_MERCHANTS.map((merchant) => {
            const Icon = merchant.icon;
            return (
              <button
                key={merchant.id}
                type="button"
                onClick={() => setSelectedMerchant(merchant)}
                className="w-full flex items-center justify-between gap-2 rounded p-2 text-left hover:bg-paper-mist transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-moss-50 text-moss-700">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-ink">{merchant.name}</p>
                    <p className="flex items-center gap-1 text-[11px] text-ink-faint">
                      <ShieldCheck size={10} className="text-moss-600" /> {merchant.feedbackRate} positive
                    </p>
                  </div>
                </div>
                <CheckCircle2 size={15} className="shrink-0 text-moss-600" />
              </button>
            );
          })}
        </div>
      </aside>

      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedMerchant(null)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-pop animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMerchant(null)}
              className="absolute right-4 top-4 rounded-full bg-paper-mist p-2 text-ink-soft hover:bg-paper-sunk cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
                {React.createElement(selectedMerchant.icon, { size: 26 })}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">{selectedMerchant.name}</h3>
                  <CheckCircle2 size={16} className="text-moss-600" />
                </div>
                <p className="flex items-center gap-1 text-xs text-ink-faint"><Store size={13} /> {selectedMerchant.category}</p>
                <p className="flex items-center gap-1 text-xs text-ink-faint"><MapPin size={13} /> {selectedMerchant.location}</p>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-paper-mist p-3 text-center">
              <div>
                <p className="text-[11px] text-ink-faint">Rating</p>
                <p className="mt-0.5 flex items-center justify-center gap-0.5 text-sm font-semibold text-ink">
                  <Star size={12} className="fill-gold text-gold" /> {selectedMerchant.rating}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-ink-faint">Feedback</p>
                <p className="mt-0.5 text-sm font-semibold text-moss-700">{selectedMerchant.feedbackRate}</p>
              </div>
              <div>
                <p className="text-[11px] text-ink-faint">Escrow</p>
                <p className="mt-0.5 text-sm font-semibold text-ink">{selectedMerchant.escrowRating}</p>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-ink-soft">{selectedMerchant.description}</p>

            <div className="space-y-2">
              <h4 className="border-b border-line pb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
                Featured inventory
              </h4>
              {selectedMerchant.products.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded bg-paper-mist p-2">
                  <div className="flex items-center gap-3">
                    <img src={item.img} alt={item.title} className="h-10 w-10 rounded object-cover" />
                    <div>
                      <p className="text-xs font-medium text-ink">{item.title}</p>
                      <Price amount={item.price} size="sm" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart?.({ title: item.title, salePrice: item.price, image: item.img });
                      setSelectedMerchant(null);
                    }}
                    className="btn-secondary btn-sm"
                  >
                    <ShoppingCart size={12} /> Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
