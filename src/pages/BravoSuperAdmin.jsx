import React, { useState } from 'react';
import { CheckCircle2, PartyPopper, Activity } from 'lucide-react';

const INITIAL_PENDING_VENDORS = [
  { id: 'v-pending-101', shopName: 'Kano Tech Hub', ownerName: 'Ibrahim Musa', email: 'musa@kanotech.ng', phone: '+234 803 123 4567', category: 'Electronics & Solar', address: '45 Zoo Road, Kano State', cacNumber: 'RC-1849201', submittedAt: '2026-07-28' },
  { id: 'v-pending-102', shopName: 'Ibadan Organics', ownerName: 'Folake Adebayo', email: 'folake@ibadanorganics.com', phone: '+234 802 987 6543', category: 'Groceries & Agro', address: '12 Bodija Market Rd, Ibadan', cacNumber: 'BN-2938402', submittedAt: '2026-07-30' },
  { id: 'v-pending-103', shopName: 'Lekki Couture', ownerName: 'Chiamaka Nwosu', email: 'chiamaka@lekkicouture.ng', phone: '+234 814 555 0192', category: 'Fashion & Wearables', address: '8 Admiralty Way, Lekki Phase 1, Lagos', cacNumber: 'RC-9921049', submittedAt: '2026-08-01' },
];

const TABS = [
  { id: 'approvals', label: 'Vendor approvals' },
  { id: 'platform_stats', label: 'System metrics' },
  { id: 'commissions', label: 'Financial settings' },
];

export default function BravoSuperAdmin({
  pendingVendorsCount = 3,
  setPendingVendorsCount = () => {},
  vendorProducts = [],
}) {
  const [activeTab, setActiveTab] = useState('approvals');
  const [pendingList, setPendingList] = useState(INITIAL_PENDING_VENDORS);
  const [commissionRate, setCommissionRate] = useState(5.0);
  const [payoutHoldDays, setPayoutHoldDays] = useState(7);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleApproveVendor = (vendorId, shopName) => {
    setPendingList((prev) => prev.filter((v) => v.id !== vendorId));
    setPendingVendorsCount((prev) => Math.max(0, prev - 1));
    showToast(`Vendor "${shopName}" has been approved.`);
  };

  const handleRejectVendor = (vendorId, shopName) => {
    setPendingList((prev) => prev.filter((v) => v.id !== vendorId));
    setPendingVendorsCount((prev) => Math.max(0, prev - 1));
    showToast(`Vendor "${shopName}" application rejected.`);
  };

  return (
    <div className="min-h-screen bg-paper-mist p-4 font-sans sm:p-6">
      <div className="mx-auto max-w-7xl">
        {toastMessage && (
          <div className="fixed right-5 top-5 z-50 animate-rise-in rounded-lg border border-line bg-ink px-5 py-3 text-sm font-medium text-white shadow-pop">
            {toastMessage}
          </div>
        )}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-paper p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-clay uppercase tracking-wider">Level 5 root access</span>
              <span className="text-xs text-ink-faint">Bravo Engine v4.2</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Bravo Super Admin HQ
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Global ecosystem oversight, merchant verification & platform economy control.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="min-w-[130px] rounded-lg border border-line bg-paper-mist px-4 py-3">
              <span className="block text-xs font-medium uppercase text-ink-faint">Pending KYC</span>
              <span className="font-display text-2xl font-semibold text-gold-700">{pendingList.length}</span>
            </div>
            <div className="min-w-[130px] rounded-lg border border-line bg-paper-mist px-4 py-3">
              <span className="block text-xs font-medium uppercase text-ink-faint">Total catalog</span>
              <span className="font-display text-2xl font-semibold text-ink">{vendorProducts.length}</span>
            </div>
            <div className="min-w-[130px] rounded-lg border border-line bg-paper-mist px-4 py-3">
              <span className="block text-xs font-medium uppercase text-ink-faint">Platform fee</span>
              <span className="font-display text-2xl font-semibold text-moss-700">{commissionRate}%</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-line pb-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id ? 'bg-moss text-white' : 'bg-paper text-ink-soft border border-line hover:bg-paper-mist'
              }`}
            >
              {tab.label}
              {tab.id === 'approvals' && pendingList.length > 0 && (
                <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs font-semibold text-gold-700">{pendingList.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-medium text-ink">Pending merchant verification applications</h2>
                <p className="text-xs text-ink-faint">Review CAC documentation, store addresses, and contact info before enabling merchant sales.</p>
              </div>
              <span className="badge-neutral">Auto-audit security: active</span>
            </div>

            {pendingList.length === 0 ? (
              <div className="card bg-moss-50 p-8 text-center">
                <PartyPopper size={30} className="mx-auto mb-2 text-moss-700" />
                <h3 className="text-base font-medium text-moss-700">All caught up!</h3>
                <p className="mt-1 text-sm text-ink-soft">There are no pending vendor registration requests in the review queue.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingList.map((vendor) => (
                  <div key={vendor.id} className="card-interactive flex flex-col justify-between gap-4 p-5 md:flex-row">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-medium text-ink">{vendor.shopName}</h3>
                        <span className="badge-gold">{vendor.category}</span>
                        <span className="font-mono text-xs text-ink-faint">ID: {vendor.id}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-x-6 gap-y-1 text-xs text-ink-soft sm:grid-cols-2 lg:grid-cols-3">
                        <div><strong className="text-ink">Owner:</strong> {vendor.ownerName}</div>
                        <div><strong className="text-ink">Email:</strong> {vendor.email}</div>
                        <div><strong className="text-ink">Phone:</strong> {vendor.phone}</div>
                        <div><strong className="text-ink">CAC reg #:</strong> <span className="font-mono text-moss-700">{vendor.cacNumber}</span></div>
                        <div className="sm:col-span-2"><strong className="text-ink">Address:</strong> {vendor.address}</div>
                      </div>
                      <div className="text-[11px] italic text-ink-faint">Submitted on {vendor.submittedAt}</div>
                    </div>

                    <div className="flex min-w-[150px] gap-2 border-t border-line pt-3 md:flex-col md:border-l md:border-t-0 md:pl-4 md:pt-0">
                      <button type="button" onClick={() => handleApproveVendor(vendor.id, vendor.shopName)} className="btn-primary btn-sm flex-1 md:flex-none">
                        <CheckCircle2 size={14} /> Approve store
                      </button>
                      <button type="button" onClick={() => handleRejectVendor(vendor.id, vendor.shopName)} className="btn-secondary btn-sm flex-1 border-clay-100 text-clay hover:bg-clay-50 md:flex-none">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'platform_stats' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-ink">Platform health & global analytics</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="card p-5">
                <span className="text-xs font-medium uppercase text-ink-faint">Total active merchants</span>
                <div className="mt-2 font-display text-3xl font-semibold text-ink">142</div>
                <p className="mt-1 text-xs font-medium text-moss-700">↑ +12% from last month</p>
              </div>
              <div className="card p-5">
                <span className="text-xs font-medium uppercase text-ink-faint">Live products listed</span>
                <div className="mt-2 font-display text-3xl font-semibold text-ink">{1240 + vendorProducts.length}</div>
                <p className="mt-1 text-xs text-ink-faint">Including dynamic vendor additions</p>
              </div>
              <div className="card p-5">
                <span className="text-xs font-medium uppercase text-ink-faint">System status</span>
                <div className="mt-2 flex items-center gap-2 text-lg font-medium text-moss-700">
                  <Activity size={16} className="animate-pulse" /> Operational (100% uptime)
                </div>
                <p className="mt-1 text-xs text-ink-faint">GPS & escrow engines online</p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-ink p-5 font-mono text-xs text-white/80">
              <div className="border-b border-white/10 pb-2 font-medium uppercase text-white">Live platform audit trail log</div>
              <div>[09:21:04] GPS node gateway: synchronized dispatch locations across 12 zones.</div>
              <div>[09:18:22] AI audit engine: scanned catalog products with 0 scam flags triggered.</div>
              <div>[09:05:10] Escrow gateway: settlement pool ₦4,520,000 locked safely in transit.</div>
            </div>
          </div>
        )}

        {activeTab === 'commissions' && (
          <div className="card max-w-2xl space-y-6 p-6">
            <div>
              <h2 className="text-lg font-medium text-ink">Financial & escrow governance</h2>
              <p className="text-xs text-ink-faint">Configure universal take rates and automated vendor payout hold periods.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="field-label">Platform take rate commission (%)</label>
                <div className="flex items-center gap-3">
                  <input type="number" step="0.5" value={commissionRate} onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)} className="input w-32" />
                  <span className="text-xs text-ink-faint">Deducted automatically from each sale upon buyer confirmation.</span>
                </div>
              </div>

              <div>
                <label className="field-label">Escrow guarantee hold period (days)</label>
                <div className="flex items-center gap-3">
                  <input type="number" value={payoutHoldDays} onChange={(e) => setPayoutHoldDays(parseInt(e.target.value, 10) || 1)} className="input w-32" />
                  <span className="text-xs text-ink-faint">Days money is held after delivery before releasing to the vendor wallet.</span>
                </div>
              </div>

              <button type="button" onClick={() => showToast('Financial governance policy saved successfully.')} className="btn-primary">
                Save configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
