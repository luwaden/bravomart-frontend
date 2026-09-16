import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId) => {
    if (onSelectCategory) onSelectCategory(categoryId);
    navigate(`/marketplace?category=${encodeURIComponent(categoryId)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 border-t border-line bg-paper-mist text-sm">
      <div className="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleNavigation('/')}
            className="font-display text-lg font-semibold text-ink cursor-pointer"
          >
            Bravo<span className="text-moss">Mart</span>
          </button>
          <p className="text-xs leading-relaxed text-ink-soft">
            Nigeria's everything-marketplace — local food markets, supermarkets, heavy equipment,
            real estate, and global imports, unified with AI-checked vendor trust.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Marketplace sectors</h4>
          <ul className="space-y-2 text-xs text-ink-soft">
            <li><button type="button" onClick={() => handleCategoryClick('local_food')} className="hover:text-ink transition-colors cursor-pointer">Local market & farm</button></li>
            <li><button type="button" onClick={() => handleCategoryClick('heavy_machinery')} className="hover:text-ink transition-colors cursor-pointer">Heavy machinery</button></li>
            <li><button type="button" onClick={() => handleCategoryClick('real_estate')} className="hover:text-ink transition-colors cursor-pointer">Real estate & land</button></li>
            <li><button type="button" onClick={() => handleCategoryClick('international')} className="hover:text-ink transition-colors cursor-pointer">Global / imports</button></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Vendors & logistics</h4>
          <ul className="space-y-2 text-xs text-ink-soft">
            <li><button type="button" onClick={() => handleNavigation('/vendor_register')} className="hover:text-ink transition-colors cursor-pointer">Register your shop</button></li>
            <li><button type="button" onClick={() => handleNavigation('/DispatcherPortal')} className="hover:text-ink transition-colors cursor-pointer">Become a dispatch rider</button></li>
            <li><button type="button" onClick={() => handleNavigation('/help')} className="hover:text-ink transition-colors cursor-pointer">Escrow & return policy</button></li>
            <li><button type="button" onClick={() => handleNavigation('/AdminAiAssistant')} className="hover:text-ink transition-colors cursor-pointer">Vendor / AI listing tool</button></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-faint">Customer care</h4>
          <p className="mb-3 text-xs text-ink-soft">24/7 support & escrow resolution.</p>
          <button
            type="button"
            onClick={() => handleNavigation('/help')}
            className="card w-full p-3 text-left hover:border-line-strong transition-colors cursor-pointer"
          >
            <span className="block text-[11px] uppercase tracking-wide text-ink-faint">Support hotline</span>
            <strong className="inline-flex items-center gap-1.5 text-sm text-ink"><Phone size={13} /> +234 800 BRAVO MART</strong>
          </button>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} BravoMart. All rights reserved.</p>
          {/* Internal operations tools — intentionally de-emphasized; not customer-facing */}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => handleNavigation('/BravoAdmin')} className="hover:text-ink-soft transition-colors cursor-pointer">Admin</button>
            <button type="button" onClick={() => handleNavigation('/BravoSuperAdmin')} className="hover:text-ink-soft transition-colors cursor-pointer">Vendor verification</button>
            <button type="button" onClick={() => handleNavigation('/DispatcherPortal')} className="hover:text-ink-soft transition-colors cursor-pointer">Dispatcher portal</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
