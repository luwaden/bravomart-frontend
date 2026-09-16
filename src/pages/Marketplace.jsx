import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { CATEGORIES, PRODUCTS } from '../data/mockData';

import Navbar from '../components/Navbar';
import AiScamModal from '../components/AiScamModal';
import AiSearchResults from '../components/AiSearchResults';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { MarketSectors } from '../components/MarketSectors';
import { OrderTracker } from '../components/OrderTracker';
import RightSidebar from '../components/RightSidebar';
import Price from '../components/ui/Price';

import {
  ShieldCheck, Sparkles, DollarSign, MapPin, Award, X, ShoppingCart,
  CheckCircle2, Filter, ChevronDown, Menu, Navigation, Mic, MicOff,
} from 'lucide-react';

const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23EFF1EC"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%237A828A" font-family="sans-serif" font-size="14">Image unavailable</text></svg>';

const calculateGpsDistanceKm = (lat, lng) => {
  if (!lat || !lng) return 2.5;
  return Math.round((Math.abs(lat) % 10 + Math.abs(lng) % 10) * 10) / 10;
};

const AI_FILTERS = [
  { id: 'cheapest', label: 'Lowest price', icon: DollarSign },
  { id: 'nearest', label: 'Nearest vendor', icon: MapPin },
  { id: 'quality', label: 'Top quality', icon: Award },
];

export default function Marketplace({ activeVendor, onVendorLogout, cartItems = [], setCartItems }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [flashDropSlideIndex, setFlashDropSlideIndex] = useState(0);
  const [aiFilter, setAiFilter] = useState('none');
  const [scamModalProduct, setScamModalProduct] = useState(null);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [orderTrackingId, setOrderTrackingId] = useState('');
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const cartCount = cartItems.length;

  useEffect(() => {
    setSelectedCategory(urlCategory);
    setSearchQuery(urlSearch);
  }, [urlCategory, urlSearch]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      handleSearchChange(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleAddToCart = (product) => {
    setCartItems?.((prev) => [...prev, product]);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    const params = new URLSearchParams();
    if (categoryId !== 'all') params.set('category', categoryId);
    setSearchParams(params);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (query.trim()) params.set('q', query);
    else params.delete('q');
    setSearchParams(params);
  };

  const handleTrackOrder = (e) => {
    e?.preventDefault?.();
    if (orderTrackingId.trim()) setIsLiveTracking(true);
    else alert('Please enter a valid order tracking ID (e.g., BM-9041).');
  };

  const flashDrops = useMemo(
    () => (PRODUCTS || []).filter((p) => p.isFlashDrop || p.salePrice < p.originalPrice),
    []
  );

  useEffect(() => {
    if (flashDrops.length === 0) return;
    const flashTimer = setInterval(() => {
      setFlashDropSlideIndex((prev) => (prev + 1) % flashDrops.length);
    }, 4500);
    return () => clearInterval(flashTimer);
  }, [flashDrops.length]);

  const processedProducts = useMemo(() => {
    let list = (PRODUCTS || []).filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = !searchQuery.trim()
        || product.title.toLowerCase().includes(searchQuery.toLowerCase())
        || (product.vendorName && product.vendorName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    if (aiFilter === 'cheapest') list.sort((a, b) => a.salePrice - b.salePrice);
    else if (aiFilter === 'nearest') {
      list.sort((a, b) => {
        const distA = a.coords ? calculateGpsDistanceKm(a.coords.lat, a.coords.lng) : (a.distanceKm || 0);
        const distB = b.coords ? calculateGpsDistanceKm(b.coords.lat, b.coords.lng) : (b.distanceKm || 0);
        return distA - distB;
      });
    } else if (aiFilter === 'quality') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [selectedCategory, searchQuery, aiFilter]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-paper">
      <Navbar
        activeVendor={activeVendor}
        onVendorLogout={onVendorLogout}
        cartCount={cartCount}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
      />

      {/* Category bar */}
      <nav aria-label="Product categories" className="sticky top-[3.75rem] z-30 border-b border-line bg-paper">
        <div className="container-page py-2.5">
          <div className="flex items-center justify-between lg:hidden">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              Categories
              {selectedCategory !== 'all' && (
                <span className="badge-moss">{CATEGORIES.find((c) => c.id === selectedCategory)?.name}</span>
              )}
            </span>
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="rounded p-1.5 text-ink-soft hover:bg-paper-mist cursor-pointer"
            >
              {isCategoryMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <div className={`${isCategoryMenuOpen ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-2 pt-2.5 lg:pt-0`}>
            {(CATEGORIES || []).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { handleCategorySelect(cat.id); setIsCategoryMenuOpen(false); }}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'border-moss bg-moss text-white'
                    : 'border-line text-ink-soft hover:border-line-strong hover:text-ink'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile filter drawer */}
      <div className="px-4 pt-4 lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="btn-secondary w-full justify-between"
        >
          <span className="inline-flex items-center gap-2"><Filter size={16} /> Sectors & order tracker</span>
          <ChevronDown size={16} className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
        </button>

        {showMobileFilters && (
          <div className="mt-3 space-y-4 animate-rise-in">
            <MarketSectors categories={CATEGORIES || []} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
            <OrderTracker orderTrackingId={orderTrackingId} setOrderTrackingId={setOrderTrackingId} isLiveTracking={isLiveTracking} onTrackOrder={handleTrackOrder} />
          </div>
        )}
      </div>

      <div className="container-page grid w-full flex-1 grid-cols-1 items-start gap-5 py-6 sm:py-8 lg:grid-cols-12">
        {/* Left sidebar */}
        <aside className="hidden max-h-[calc(100vh-6rem)] space-y-4 overflow-y-auto lg:sticky lg:top-32 lg:col-span-2 lg:block">
          <MarketSectors categories={CATEGORIES || []} selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
          <OrderTracker orderTrackingId={orderTrackingId} setOrderTrackingId={setOrderTrackingId} isLiveTracking={isLiveTracking} onTrackOrder={handleTrackOrder} />
          <div className="card bg-moss-50 p-4">
            <ShieldCheck size={22} className="mb-2 text-moss-700" />
            <h4 className="mb-1 text-sm font-medium text-ink">Escrow protected</h4>
            <p className="text-xs leading-relaxed text-ink-soft">
              Funds are held for 7 days until you confirm you received the exact item ordered.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="space-y-6 lg:col-span-8 sm:space-y-8">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={isListening ? 'btn-danger btn-sm' : 'btn-secondary btn-sm'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? 'Listening…' : 'Voice search'}
            </button>
          </div>

          {searchQuery.trim() !== '' && (
            <AiSearchResults
              searchQuery={searchQuery}
              products={PRODUCTS || []}
              onAddToCart={handleAddToCart}
              onScanScam={(p) => setScamModalProduct(p)}
              onQuickSearch={(term) => handleSearchChange(term)}
            />
          )}

          <HeroSection
            flashDrops={flashDrops}
            flashDropSlideIndex={flashDropSlideIndex}
            setFlashDropSlideIndex={setFlashDropSlideIndex}
            onAddToCart={handleAddToCart}
          />

          {/* GPS rider banner */}
          <section className="card flex flex-col items-center gap-6 overflow-hidden p-6 md:flex-row">
            <div className="max-w-lg space-y-3 text-center md:text-left">
              <span className="badge-moss">
                <Navigation size={12} className="mr-1" /> Live GPS route active
              </span>
              <h3 className="section-heading">Track your rider in real time</h3>
              <p className="text-sm leading-relaxed text-ink-soft">
                Follow the dispatch rider's optimized route to your door, with a direct link to
                navigate the same route on Google Maps.
              </p>
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex"
              >
                <Navigation size={16} /> Open in Maps
              </a>
            </div>
            <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-lg md:w-64">
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80"
                alt="Dispatch rider en route"
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
              />
            </div>
          </section>

          {/* AI filters */}
          <section className="card p-5 sm:p-6">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
                <Sparkles size={16} className="text-moss" /> Smart filters
              </h3>
              <span className="text-xs text-ink-faint">Sort intelligently:</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {AI_FILTERS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAiFilter(aiFilter === id ? 'none' : id)}
                  className={aiFilter === id ? 'btn-primary' : 'btn-secondary'}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>
          </section>

          {/* Product grid */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="section-heading">Marketplace</h2>
              <span className="text-xs text-ink-faint">{processedProducts.length} items</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {processedProducts.map((product) => (
                <div key={product.id} onClick={() => setSelectedProductModal(product)} className="cursor-pointer">
                  <ProductCard
                    product={product}
                    calculateGpsDistanceKm={calculateGpsDistanceKm}
                    onAddToCart={(e) => { e?.stopPropagation?.(); handleAddToCart(product); }}
                    onScanScam={(p) => setScamModalProduct(p)}
                  />
                </div>
              ))}
              {processedProducts.length === 0 && (
                <div className="col-span-full card p-10 text-center text-sm text-ink-soft">
                  No products match your filters. Try a different category or search term.
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Right sidebar */}
        <aside className="hidden max-h-[calc(100vh-6rem)] overflow-y-auto lg:sticky lg:top-32 lg:col-span-2 lg:block">
          <RightSidebar products={PRODUCTS || []} activeSlideIndex={activeSlideIndex} setActiveSlideIndex={setActiveSlideIndex} onAddToCart={handleAddToCart} />
        </aside>
      </div>

      {/* Product detail modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProductModal(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-pop animate-scale-in sm:p-8" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedProductModal(null)}
              className="absolute right-4 top-4 rounded-full bg-paper-mist p-2.5 text-ink-soft hover:bg-paper-sunk cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col gap-6 sm:flex-row">
              <img
                src={selectedProductModal.image || FALLBACK_IMAGE}
                alt={selectedProductModal.title}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className="h-56 w-full shrink-0 rounded-lg object-cover sm:w-56"
              />
              <div className="flex-1 space-y-3">
                <span className="badge-neutral">{selectedProductModal.category || 'General'}</span>
                <h3 className="font-display text-2xl font-semibold text-ink">{selectedProductModal.title}</h3>
                <Price amount={selectedProductModal.salePrice} originalAmount={selectedProductModal.originalPrice} size="lg" />
                <div className="space-y-1 text-sm text-ink-soft">
                  <p><strong className="text-ink">Vendor:</strong> {selectedProductModal.vendorName || 'Verified merchant'}</p>
                  <p className="flex items-center gap-1.5 text-moss-700"><CheckCircle2 size={16} /> Escrow protection available</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-ink-soft">
              <h4 className="font-medium text-ink">Description</h4>
              <p className="leading-relaxed">
                {selectedProductModal.description || 'High-quality item sourced from a verified seller on BravoMart, with fast local dispatch and real-time rider tracking.'}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => { handleAddToCart(selectedProductModal); setSelectedProductModal(null); }}
                className="btn-secondary flex-1"
              >
                <ShoppingCart size={18} /> Add to cart
              </button>
              <button
                type="button"
                onClick={() => { handleAddToCart(selectedProductModal); setSelectedProductModal(null); navigate('/checkout'); }}
                className="btn-primary flex-1"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      )}

      {scamModalProduct && <AiScamModal product={scamModalProduct} onClose={() => setScamModalProduct(null)} />}

      <Footer />
    </div>
  );
}
