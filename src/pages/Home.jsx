import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, ArrowRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/mockData';

const CATEGORY_ICON_HINT = {
  all: '🌐', local_food: '🌾', groceries: '🛒', real_estate: '🏠',
  heavy_machinery: '🚜', electronics: '📱', international: '✈️', fashion: '👕',
};

const STEPS = [
  { n: '1', title: 'Search & compare', body: 'Find the same item across nearby vendors, ranked by price, rating, and distance.' },
  { n: '2', title: 'Check the trust score', body: 'Every listing carries an AI-generated report on the vendor before you pay.' },
  { n: '3', title: 'Buy with escrow', body: 'Your payment is held for 7 days until you confirm the exact item arrived.' },
];

const calculateGpsDistanceKm = (lat, lng) => {
  if (!lat || !lng) return 2.5;
  return Math.round((Math.abs(lat) % 10 + Math.abs(lng) % 10) * 10) / 10;
};

export default function Home({ activeVendor, onVendorLogout, cartCount = 0 }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const featured = (PRODUCTS || []).filter((p) => p.rating >= 4.7).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar
        activeVendor={activeVendor}
        onVendorLogout={onVendorLogout}
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero */}
      <section className="border-b border-line bg-paper-mist">
        <div className="container-page grid grid-cols-1 items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
          <div className="animate-rise-in">
            <span className="badge-moss mb-5">Now serving Lagos & 35 states</span>
            <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Everything you need, from vendors you can trust.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              Garri from the stall down the road, an excavator for the site, or a plot of land —
              one marketplace, with every listing checked for trust before you buy.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                navigate(q ? `/marketplace?q=${encodeURIComponent(q)}` : '/marketplace');
              }}
              className="relative mt-8 max-w-md"
            >
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search garri, excavators, solar inverters…"
                className="input rounded-full pl-11 pr-28 py-3.5"
              />
              <button type="submit" className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full">
                Search
              </button>
            </form>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div><span className="font-display text-xl font-semibold text-ink">7 days</span><span className="ml-1.5 text-ink-faint">escrow window</span></div>
              <div><span className="font-display text-xl font-semibold text-ink">8</span><span className="ml-1.5 text-ink-faint">market sectors</span></div>
              <div><span className="font-display text-xl font-semibold text-ink">AI</span><span className="ml-1.5 text-ink-faint">trust scoring</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featured.map((product) => (
              <div key={product.id} onClick={() => navigate('/marketplace')} className="cursor-pointer">
                <ProductCard
                  product={product}
                  calculateGpsDistanceKm={calculateGpsDistanceKm}
                  onAddToCart={(e) => { e?.stopPropagation?.(); navigate('/marketplace'); }}
                  onScanScam={(e) => { e?.stopPropagation?.(); navigate('/marketplace'); }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="container-page py-14 sm:py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="section-heading">Shop by sector</h2>
          <button type="button" onClick={() => navigate('/marketplace')} className="inline-flex items-center gap-1 text-sm font-medium text-moss-700 hover:text-moss-800 cursor-pointer">
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate(`/marketplace?category=${cat.id}`)}
              className="card-interactive flex flex-col items-start gap-3 p-5 text-left"
            >
              <span className="text-2xl" aria-hidden="true">{CATEGORY_ICON_HINT[cat.id]}</span>
              <span className="text-sm font-medium text-ink">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-paper-mist py-14 sm:py-16">
        <div className="container-page">
          <h2 className="section-heading mb-10">How buying safely works</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-display text-3xl font-semibold text-moss-300">{step.n}</span>
                <h3 className="mt-3 text-base font-medium text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sell / dispatch CTA */}
      <section className="container-page py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card flex flex-col items-start gap-3 p-7">
            <Store size={22} className="text-moss-700" />
            <h3 className="text-lg font-medium text-ink">Sell on BravoMart</h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              List your shop free for a year, reach buyers by distance, and get paid through escrow.
            </p>
            <button type="button" onClick={() => navigate('/vendor_register')} className="btn-primary mt-1">
              Register your shop
            </button>
          </div>
          <div className="card flex flex-col items-start gap-3 p-7">
            <Truck size={22} className="text-moss-700" />
            <h3 className="text-lg font-medium text-ink">Become a dispatch rider</h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              Pick up delivery routes near you and get paid per completed dispatch.
            </p>
            <button type="button" onClick={() => navigate('/DispatcherPortal')} className="btn-secondary mt-1">
              Learn more
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
