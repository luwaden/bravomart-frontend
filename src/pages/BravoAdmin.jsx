import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Lock, ArrowLeft } from 'lucide-react';
import { formatNaira } from '../components/ui/Price';

const STATS = {
  totalSales: 48250000,
  escrowLocked: 12400000,
  activeVendors: 142,
  pendingVerifications: 5,
};

const PENDING_VENDORS = [
  { id: 1, name: 'Alaba Mega Tech', owner: 'Chidi Nnamdi', phone: '08031112233', category: 'Electronics', status: 'Pending CAC' },
  { id: 2, name: 'Lekki Fashion Hub', owner: 'Bisi Adebayo', phone: '08022223344', category: 'Apparel', status: 'Pending ID' },
];

const ESCROW_TRANSACTIONS = [
  { orderId: 'B9823104921', buyer: 'Samuel O.', vendor: 'TechHub Ltd', amount: 145000, status: 'Held in escrow', rider: 'Tunde B.' },
  { orderId: 'B7712390122', buyer: 'Amina K.', vendor: 'Fashion Direct', amount: 32000, status: 'Delivered — pending release', rider: 'Sani M.' },
];

const TABS = ['overview', 'vendors', 'escrow'];

export default function BravoAdmin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-paper-mist py-6 px-4 font-sans sm:py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gold-50 p-2 text-gold-700">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">Bravo Admin control desk</h1>
              <p className="text-xs text-ink-faint">Platform escrow, vendor approvals & system oversight</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/')} className="btn-secondary btn-sm">
            <ArrowLeft size={14} /> Exit to store
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-line pb-2 text-xs font-medium">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 rounded-full px-4 py-2 capitalize transition-colors cursor-pointer ${
                activeTab === tab ? 'bg-moss text-white' : 'bg-paper text-ink-soft hover:bg-paper-sunk border border-line'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="card p-4">
            <p className="text-[11px] font-medium text-ink-faint">Total platform volume</p>
            <p className="mt-1 font-display text-lg font-semibold text-ink sm:text-2xl">{formatNaira(STATS.totalSales)}</p>
          </div>
          <div className="card p-4">
            <p className="text-[11px] font-medium text-ink-faint">Escrow funds locked</p>
            <p className="mt-1 font-display text-lg font-semibold text-moss-700 sm:text-2xl">{formatNaira(STATS.escrowLocked)}</p>
          </div>
          <div className="card p-4">
            <p className="text-[11px] font-medium text-ink-faint">Active vendors</p>
            <p className="mt-1 font-display text-lg font-semibold text-ink sm:text-2xl">{STATS.activeVendors}</p>
          </div>
          <div className="card p-4">
            <p className="text-[11px] font-medium text-ink-faint">Pending verifications</p>
            <p className="mt-1 font-display text-lg font-semibold text-clay sm:text-2xl">{STATS.pendingVerifications}</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="card space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Users size={16} className="text-moss-700" /> Pending vendor applications
                </h3>
                <span className="badge-gold">{PENDING_VENDORS.length} action needed</span>
              </div>
              <div className="space-y-2.5">
                {PENDING_VENDORS.map((v) => (
                  <div key={v.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line p-3.5 text-xs">
                    <div>
                      <p className="font-medium text-ink">{v.name}</p>
                      <p className="text-[11px] text-ink-faint">{v.owner} · {v.phone} · {v.category}</p>
                    </div>
                    <button type="button" onClick={() => navigate('/BravoSuperAdmin')} className="btn-primary btn-sm">
                      Review application
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Lock size={16} className="text-moss-700" /> Escrow release approvals
                </h3>
                <span className="badge-moss">Live</span>
              </div>
              <div className="space-y-2.5">
                {ESCROW_TRANSACTIONS.map((tx, idx) => (
                  <div key={idx} className="space-y-2 rounded-lg border border-line p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-gold-700">{tx.orderId}</span>
                      <span className="font-semibold text-ink">{formatNaira(tx.amount)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-ink-faint">
                      <span>Buyer: {tx.buyer}</span>
                      <span>Vendor: {tx.vendor}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-line pt-2">
                      <span className="text-[11px] font-medium text-moss-700">● {tx.status}</span>
                      <button type="button" className="btn-secondary btn-sm">Force manual release</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="card space-y-3 p-5">
            <h3 className="text-sm font-medium text-ink">Merchant directory & compliance</h3>
            <p className="text-xs text-ink-faint">Review, ban, or update store status across all active BravoMart vendors.</p>
            <div className="rounded-lg border border-dashed border-line-strong bg-paper-mist p-8 text-center text-xs italic text-ink-faint">
              Vendor directory database controls will display here.
            </div>
          </div>
        )}

        {activeTab === 'escrow' && (
          <div className="card space-y-3 p-5">
            <h3 className="text-sm font-medium text-ink">Escrow dispute resolution center</h3>
            <p className="text-xs text-ink-faint">Arbitrate contested payments between buyers and merchants.</p>
            <div className="rounded-lg border border-dashed border-line-strong bg-paper-mist p-8 text-center text-xs italic text-ink-faint">
              Active escrow dispute queue will display here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
