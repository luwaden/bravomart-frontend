import React from 'react';
import { PackageSearch, Radio, MapPin } from 'lucide-react';

export function OrderTracker({ orderTrackingId, setOrderTrackingId, isLiveTracking, onTrackOrder }) {
  return (
    <div className="card p-4 space-y-3">
      <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
        <PackageSearch size={14} /> Track an order
      </h3>

      <form onSubmit={onTrackOrder} className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. BM-9041"
          value={orderTrackingId}
          onChange={(e) => setOrderTrackingId(e.target.value)}
          className="input text-xs py-2"
        />
        <button type="submit" className="btn-primary btn-sm shrink-0">
          Track
        </button>
      </form>

      {isLiveTracking && (
        <div className="rounded border border-moss-200 bg-moss-50 p-3 text-xs text-moss-700 space-y-1.5">
          <div className="flex items-center justify-between font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Radio size={13} className="animate-pulse" /> Dispatcher en route
            </span>
            <span className="badge-moss">Live</span>
          </div>
          <div className="flex items-start gap-1.5 text-ink-soft">
            <MapPin size={12} className="mt-0.5 shrink-0" />
            <span>Rider #4012 is 1.8km away with your delivery.</span>
          </div>
        </div>
      )}
    </div>
  );
}
