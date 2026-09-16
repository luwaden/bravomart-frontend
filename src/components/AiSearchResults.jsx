import React from 'react';
import {
  ShieldCheck, ShoppingCart, Star, Sparkles, MapPin,
  TrendingUp, SearchX, ArrowUpDown,
} from 'lucide-react';
import Price from './ui/Price';

const POPULAR_SEARCHES = ['Solar Inverters', 'Yellow Garri', 'Excavator CAT 320', 'Yam Tubers', 'Fertilizer', 'Lithium Battery'];
const PEOPLE_ALSO_SEARCH = ['Diesel Generators', 'Cold Room Storage', 'Tractors', 'Rice 50kg'];

export default function AiSearchResults({ searchQuery, products, onAddToCart, onScanScam, onQuickSearch }) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return null;

  const rankedProducts = products
    .map((product) => {
      const title = (product.title || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const vendor = (product.vendorName || '').toLowerCase();
      const category = (product.category || '').toLowerCase();

      let matchScore = 0;
      let matchType = 'none';
      if (title === query) { matchScore = 100; matchType = 'Exact match'; }
      else if (title.includes(query)) { matchScore = 80; matchType = 'Title match'; }
      else if (category.includes(query) || vendor.includes(query)) { matchScore = 60; matchType = 'Category / vendor'; }
      else if (description.includes(query)) { matchScore = 40; matchType = 'Description match'; }
      if (matchScore === 0) return null;

      const rating = product.rating || 4.0;
      const qualityMultiplier = rating >= 4.0 ? 1.3 : rating >= 3.0 ? 1.0 : 0.2;
      const priceScore = 1000000 / (product.salePrice || 1);
      const distancePenalty = (product.distanceKm || 10) * 2;
      const totalScore = (matchScore * qualityMultiplier * 10) + (priceScore * 0.1) - distancePenalty;

      return { ...product, matchScore, matchType, totalScore };
    })
    .filter(Boolean)
    .sort((a, b) => b.totalScore - a.totalScore);

  const relatedProducts = products.filter((p) => p.rating >= 4.2).slice(0, 3);
  const mostSearchedProducts = products.filter((p) => p.isFlashDrop || p.rating >= 4.5).slice(0, 6);

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="font-display text-base font-semibold text-ink">AI search results</h2>
            <p className="text-xs text-ink-faint">Ranked by match, rating, price, and distance</p>
          </div>
        </div>
        <span className="badge-neutral">
          <ArrowUpDown size={12} className="mr-0.5" /> {rankedProducts.length} results
        </span>
      </div>

      {rankedProducts.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rankedProducts.map((product) => (
              <div key={product.id} className="card-interactive flex flex-col overflow-hidden">
                <div className="relative h-40 w-full overflow-hidden bg-paper-sunk">
                  <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onScanScam(product)}
                    className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-paper/95 px-2 py-1 text-[11px] font-medium text-ink-soft border border-line cursor-pointer"
                  >
                    <ShieldCheck size={12} className="text-moss-600" /> Scam check
                  </button>
                  <span className="absolute left-2 top-2 badge-moss bg-moss text-white">{product.matchType}</span>
                </div>

                <div className="flex flex-1 flex-col p-3.5">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-ink-faint">
                    <span className="truncate font-medium text-ink-soft">{product.vendorName}</span>
                    <span className="inline-flex items-center gap-0.5 text-gold-600"><Star size={11} className="fill-current" /> {product.rating || '4.5'}</span>
                    <span className="inline-flex items-center gap-0.5"><MapPin size={11} /> {product.distanceKm} km</span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 flex-1 text-sm font-medium text-ink">{product.title}</h3>
                  <div className="mb-3">
                    <Price amount={product.salePrice} originalAmount={product.originalPrice} size="sm" />
                  </div>
                  <button type="button" onClick={() => onAddToCart(product)} className="btn-primary btn-sm w-full">
                    <ShoppingCart size={14} /> Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-line pt-5">
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-medium text-ink-soft">
              <TrendingUp size={14} className="text-moss" /> People also search for &ldquo;{searchQuery}&rdquo;
            </h4>
            <div className="flex flex-wrap gap-2">
              {PEOPLE_ALSO_SEARCH.map((term) => (
                <button key={term} type="button" onClick={() => onQuickSearch(term)} className="btn-secondary btn-sm rounded-full">
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="rounded-lg bg-clay-50 p-6 text-center">
            <SearchX size={32} className="mx-auto mb-2 text-clay" />
            <h3 className="text-sm font-medium text-clay-600">No products found for &ldquo;{searchQuery}&rdquo;</h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-ink-soft">
              Try a broader category keyword, like "Garri", "Solar", or "Excavator".
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-medium text-ink-soft">Frequently searched</h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button key={term} type="button" onClick={() => onQuickSearch(term)} className="btn-secondary btn-sm rounded-full">
                  {term}
                </button>
              ))}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-medium text-ink">Recommended for you</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="card flex items-center gap-3 p-3">
                    <img src={p.image} alt={p.title} className="h-14 w-14 shrink-0 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <h5 className="truncate text-xs font-medium text-ink">{p.title}</h5>
                      <Price amount={p.salePrice} size="sm" />
                      <button type="button" onClick={() => onAddToCart(p)} className="mt-1 text-[11px] font-medium text-moss-700 hover:underline cursor-pointer">
                        + Add item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mostSearchedProducts.length > 0 && (
            <div className="border-t border-line pt-6">
              <h4 className="mb-3 text-sm font-medium text-ink">Most searched on BravoMart</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {mostSearchedProducts.map((prod) => (
                  <button
                    type="button"
                    key={prod.id}
                    onClick={() => onAddToCart(prod)}
                    className="card-interactive p-2 text-left"
                  >
                    <img src={prod.image} alt={prod.title} className="mb-2 h-20 w-full rounded object-cover" />
                    <h6 className="line-clamp-1 text-[11px] font-medium text-ink">{prod.title}</h6>
                    <Price amount={prod.salePrice} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
