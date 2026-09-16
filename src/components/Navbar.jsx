import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, User, Sparkles, ChevronDown,
  Headphones, HelpCircle, Menu, X, MapPin, Store, LogOut,
} from 'lucide-react';

/**
 * Consumer-facing top navigation. Internal operations tools (BravoAdmin,
 * BravoSuperAdmin verification queue, DispatcherPortal) intentionally do NOT
 * live here — they were previously exposed in the main shopper nav (including
 * a live "pending verifications" count), which leaks internal ops state to
 * every customer. Those tools are linked from the site Footer under
 * "Operations" instead, and are reachable directly by URL for staff.
 */
export default function Navbar({
  activeVendor,
  onVendorLogout,
  cartCount = 0,
  searchQuery,
  setSearchQuery,
}) {
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const helpDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target)) {
        setIsHelpOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHelpNavigation = (tab) => {
    setIsHelpOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/help?tab=${tab}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = (searchQuery || '').trim();
    navigate(trimmed ? `/marketplace?q=${encodeURIComponent(trimmed)}` : '/marketplace');
  };

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-line">
      {/* Utility strip */}
      <div className="hidden sm:block border-b border-line bg-paper-mist">
        <div className="container-page flex items-center justify-between py-1.5 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> Delivering to <b className="text-ink">Lagos, Nigeria</b>
          </span>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate('/about')} className="hover:text-ink transition-colors cursor-pointer">
              About
            </button>
            <div className="relative" ref={helpDropdownRef}>
              <button
                type="button"
                onClick={() => setIsHelpOpen((v) => !v)}
                className="inline-flex items-center gap-1 hover:text-ink transition-colors cursor-pointer"
              >
                Help <ChevronDown size={12} className={`transition-transform duration-150 ${isHelpOpen ? 'rotate-180' : ''}`} />
              </button>
              {isHelpOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-paper border border-line rounded shadow-float py-1 z-50 animate-scale-in origin-top-right">
                  <button
                    type="button"
                    onClick={() => handleHelpNavigation('support')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink hover:bg-paper-mist transition-colors cursor-pointer"
                  >
                    <Headphones size={14} className="text-ink-faint" /> Customer support
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHelpNavigation('faq')}
                    className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink hover:bg-paper-mist transition-colors cursor-pointer"
                  >
                    <HelpCircle size={14} className="text-ink-faint" /> FAQ
                  </button>
                </div>
              )}
            </div>
            {activeVendor ? (
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => navigate('/AdminAiAssistant')} className="hover:text-ink transition-colors cursor-pointer">
                  {activeVendor.shopName || 'Vendor'} dashboard
                </button>
                <button type="button" onClick={onVendorLogout} className="inline-flex items-center gap-1 hover:text-clay transition-colors cursor-pointer">
                  <LogOut size={12} /> Log out
                </button>
              </div>
            ) : (
              <>
                <button type="button" onClick={() => navigate('/vendor_register')} className="inline-flex items-center gap-1 hover:text-ink transition-colors cursor-pointer">
                  <Store size={12} /> Sell on BravoMart
                </button>
                <button type="button" onClick={() => navigate('/vendor_login')} className="hover:text-ink transition-colors cursor-pointer">
                  Vendor login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Primary row */}
      <div className="container-page flex items-center gap-3 py-3 md:gap-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="shrink-0 cursor-pointer select-none"
        >
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Bravo<span className="text-moss">Mart</span>
          </span>
        </button>

        <form onSubmit={handleSearchSubmit} className="order-3 w-full md:order-2 md:flex-1 max-w-2xl relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="Search garri, yam, excavators, solar inverters…"
            className="input rounded-full pl-10 pr-11"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-moss text-white flex items-center justify-center hover:bg-moss-700 transition-colors cursor-pointer"
          >
            <Sparkles size={14} />
          </button>
        </form>

        <div className="order-2 ml-auto flex items-center gap-1 md:order-3 md:ml-0 md:gap-2">
          <button
            type="button"
            onClick={() => navigate('/account')}
            className="hidden sm:flex items-center gap-2 rounded px-2.5 py-1.5 hover:bg-paper-mist transition-colors cursor-pointer"
          >
            <User size={20} className="text-ink-soft" />
            <span className="text-xs text-left leading-tight">
              <span className="block text-ink-faint">Account</span>
              <span className="block font-medium text-ink">Sign in</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="relative flex items-center gap-1.5 rounded-full bg-paper-mist hover:bg-paper-sunk px-3 py-2 transition-colors cursor-pointer"
          >
            <ShoppingCart size={18} className="text-ink" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className="sm:hidden p-2 rounded hover:bg-paper-mist cursor-pointer"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-line bg-paper p-4 space-y-3 animate-rise-in">
          <div className="flex items-center gap-1.5 text-xs text-ink-soft">
            <MapPin size={12} /> Delivering to <b className="text-ink">Lagos, Nigeria</b>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button type="button" onClick={() => { setIsMobileMenuOpen(false); navigate('/account'); }} className="btn-secondary btn-sm justify-start">
              <User size={14} /> Account
            </button>
            <button type="button" onClick={() => { setIsMobileMenuOpen(false); navigate('/about'); }} className="btn-secondary btn-sm justify-start">
              About
            </button>
            <button type="button" onClick={() => { setIsMobileMenuOpen(false); handleHelpNavigation('support'); }} className="btn-secondary btn-sm justify-start">
              <Headphones size={14} /> Support
            </button>
            {activeVendor ? (
              <button type="button" onClick={() => { setIsMobileMenuOpen(false); navigate('/AdminAiAssistant'); }} className="btn-secondary btn-sm justify-start">
                <Store size={14} /> Vendor dashboard
              </button>
            ) : (
              <button type="button" onClick={() => { setIsMobileMenuOpen(false); navigate('/vendor_register'); }} className="btn-secondary btn-sm justify-start">
                <Store size={14} /> Sell on BravoMart
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
