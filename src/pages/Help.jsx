import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, HelpCircle, Phone, MessageSquare, Mail, ChevronDown,
  Headphones, Send, CheckCircle2, ShieldCheck, ArrowLeft,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQS = [
  { cat: 'orders', q: 'How does the BravoMart 30-minute dispatch assignment work?', a: 'When you place an order, our system alerts the nearest available dispatch riders. The assigned rider has 30 minutes to confirm pickup. If unavailable, the order is automatically reassigned to the next best rider.' },
  { cat: 'escrow', q: 'What is escrow protection and when is payment released?', a: 'Your money is held in escrow when you place an order. Vendors and riders are paid only after you inspect and confirm receipt. You have up to 7 days to report a defect.' },
  { cat: 'returns', q: 'How do I request a refund or replacement?', a: 'Go to your account dashboard under "My orders", select the item, and choose "Dispute / return order". Upload photos of the damaged or wrong product and support will respond within 24 hours.' },
  { cat: 'vendor', q: 'How do I become a verified vendor on BravoMart?', a: 'Choose "Sell on BravoMart" from the homepage, complete business verification (ID and bank details), and start listing once approved by BravoMart admin.' },
];

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All FAQs' },
  { id: 'orders', label: 'Dispatch & delivery' },
  { id: 'escrow', label: 'Escrow & payments' },
  { id: 'returns', label: 'Refunds & returns' },
  { id: 'vendor', label: 'Vendor guide' },
];

export default function Help() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'support');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketData, setTicketData] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'support' || tabFromUrl === 'faq') setActiveTab(tabFromUrl);
  }, [searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  const filteredFaqs = FAQS.filter(
    (faq) =>
      (activeCategory === 'all' || faq.cat === activeCategory) &&
      (faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (ticketData.name && ticketData.email && ticketData.message) {
      setTicketSubmitted(true);
      setTimeout(() => {
        setTicketSubmitted(false);
        setTicketData({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar cartCount={0} />

      <div className="container-page flex-1 space-y-8 py-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Help & support</h1>
            <p className="mt-0.5 text-sm text-ink-soft">
              {activeTab === 'support' ? 'Reach the 24/7 customer support & resolution team.' : 'Browse frequently asked questions and quick guides.'}
            </p>
          </div>
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">
            <ArrowLeft size={14} /> Back to store
          </button>
        </div>

        <div className="mx-auto flex max-w-md rounded-lg bg-paper-mist p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => handleTabChange('support')}
            className={`flex flex-1 items-center justify-center gap-2 rounded py-2.5 transition-colors cursor-pointer ${activeTab === 'support' ? 'bg-paper shadow-sm text-moss-700' : 'text-ink-faint'}`}
          >
            <Headphones size={15} /> Customer support
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('faq')}
            className={`flex flex-1 items-center justify-center gap-2 rounded py-2.5 transition-colors cursor-pointer ${activeTab === 'faq' ? 'bg-paper shadow-sm text-moss-700' : 'text-ink-faint'}`}
          >
            <HelpCircle size={15} /> FAQ
          </button>
        </div>

        {activeTab === 'support' && (
          <div className="animate-rise-in space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="card space-y-2 p-5 text-center">
                <MessageSquare className="mx-auto text-moss-700" size={26} />
                <h4 className="text-sm font-medium text-ink">WhatsApp live chat</h4>
                <p className="text-[11px] text-ink-faint">Instant responses from active agents.</p>
                <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer" className="btn-primary btn-sm mt-1 inline-flex">
                  Start chat
                </a>
              </div>
              <div className="card space-y-2 p-5 text-center">
                <Phone className="mx-auto text-moss-700" size={26} />
                <h4 className="text-sm font-medium text-ink">Phone hotline</h4>
                <p className="text-[11px] text-ink-faint">Mon–Sat, 8:00am–8:00pm WAT.</p>
                <a href="tel:+2348000000000" className="btn-secondary btn-sm mt-1 inline-flex">
                  0800-BRAVO-HELP
                </a>
              </div>
              <div className="card space-y-2 p-5 text-center">
                <Mail className="mx-auto text-moss-700" size={26} />
                <h4 className="text-sm font-medium text-ink">Email desk</h4>
                <p className="text-[11px] text-ink-faint">Direct response within 2 hours.</p>
                <a href="mailto:support@bravomart.com" className="btn-secondary btn-sm mt-1 inline-flex">
                  Send email
                </a>
              </div>
            </div>

            <div className="card space-y-4 p-6">
              <div className="flex items-center gap-2 border-b border-line pb-3">
                <Headphones className="text-moss-700" size={19} />
                <h3 className="text-sm font-medium text-ink">Submit a support ticket</h3>
              </div>

              {ticketSubmitted ? (
                <div className="rounded-lg bg-moss-50 p-6 text-center">
                  <CheckCircle2 size={32} className="mx-auto text-moss-600" />
                  <h4 className="mt-2 text-sm font-medium text-moss-700">Ticket submitted</h4>
                  <p className="mt-1 text-xs text-ink-soft">
                    A support specialist has been assigned and will reply via email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="field-label">Your full name *</label>
                      <input type="text" required placeholder="John Doe" value={ticketData.name} onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })} className="input" />
                    </div>
                    <div>
                      <label className="field-label">Your email address *</label>
                      <input type="email" required placeholder="john@example.com" value={ticketData.email} onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })} className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Subject / order ID (optional)</label>
                    <input type="text" placeholder="e.g. Issue with order BM-9041" value={ticketData.subject} onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label className="field-label">Describe your issue *</label>
                    <textarea required rows={4} placeholder="Explain what happened so support can resolve it quickly…" value={ticketData.message} onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })} className="input resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    <Send size={16} /> Submit ticket
                  </button>
                </form>
              )}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-ink px-5 py-5 text-white sm:flex-row">
              <div className="flex items-center gap-3">
                <ShieldCheck size={28} className="shrink-0 text-gold-200" />
                <div>
                  <h4 className="text-sm font-medium">7-day escrow buyer guarantee</h4>
                  <p className="text-xs text-white/60">Your payments are protected until you inspect your item.</p>
                </div>
              </div>
              <button type="button" onClick={() => handleTabChange('faq')} className="btn-secondary btn-sm shrink-0 border-white/20 bg-transparent text-white hover:bg-white/10">
                Learn more
              </button>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="animate-rise-in space-y-6">
            <div className="card space-y-3 p-4 sm:p-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" size={17} />
                <input
                  type="text"
                  placeholder="Search help articles (e.g. escrow, tracking, dispatch)…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={activeCategory === cat.id ? 'btn-primary btn-sm rounded-full' : 'btn-secondary btn-sm rounded-full'}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card space-y-3 p-4 sm:p-6">
              <h3 className="border-b border-line pb-3 text-sm font-medium text-ink">Frequently asked questions</h3>
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="overflow-hidden rounded-lg border border-line">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="flex w-full items-center justify-between gap-2 bg-paper-mist p-4 text-left text-sm font-medium text-ink transition-colors hover:bg-paper-sunk cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown size={16} className={`shrink-0 text-ink-faint transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaqIndex === idx && (
                      <div className="border-t border-line p-4 text-sm leading-relaxed text-ink-soft">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-ink-faint">No matching FAQs found for your search term.</p>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
