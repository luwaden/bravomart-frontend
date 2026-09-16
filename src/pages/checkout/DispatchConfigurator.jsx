import React from 'react';
import { MapPin, Truck, MessageSquare, Phone, Clock } from 'lucide-react';

const VEHICLES = [
  { id: 'motorcycle', name: 'Motorcycle', label: 'Light items / envelopes' },
  { id: 'tricycle', name: 'Tricycle (Keke)', label: 'Medium boxes' },
  { id: 'car', name: 'Sedan / car', label: 'Fragile / electronics' },
  { id: 'van', name: 'Delivery van', label: 'Bulk store orders' },
  { id: 'truck', name: 'Heavy truck', label: 'Heavy machinery' },
];

export default function DispatchConfigurator({
  pickupLocations,
  isMultiPickup,
  deliveryAddress,
  setDeliveryAddress,
  userAccount,
  vehicleChoice,
  setVehicleChoice,
  filteredRiders,
  assignedRider,
  onSelectRider,
  timerSeconds,
  formatTimer,
  getWhatsAppDispatchLink,
}) {
  return (
    <div className="space-y-5">
      {/* Pickup + delivery addresses */}
      <div className="card space-y-3 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
            <MapPin size={17} className="text-moss-700" /> Vendor pickup route
          </h3>
          {isMultiPickup && <span className="badge-gold">5% multi-pickup discount</span>}
        </div>

        <p className="text-xs text-ink-faint">
          Addresses are synchronized from vendor shop registrations and product locations.
        </p>

        <div className="space-y-2">
          {pickupLocations.map((loc, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded bg-paper-mist p-2.5 text-xs">
              <span className="w-16 shrink-0 font-medium text-ink-faint">Pickup #{idx + 1}</span>
              <span className="truncate font-medium text-ink">{loc}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-line pt-3">
          <label className="field-label">
            Delivery destination {userAccount && '(auto-filled)'}
          </label>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter destination address…"
            className="input text-xs"
          />
        </div>
      </div>

      {/* Vehicle selector */}
      <div className="card p-4 sm:p-6">
        <h3 className="mb-1 flex items-center gap-2 text-sm font-medium text-ink">
          <Truck size={17} className="text-moss-700" /> Select dispatch vehicle
        </h3>
        <p className="mb-4 text-xs text-ink-faint">
          Matches load size and filters riders operating that vehicle type.
        </p>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {VEHICLES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVehicleChoice(v.id)}
              className={`rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                vehicleChoice === v.id
                  ? 'border-moss bg-moss-50'
                  : 'border-line hover:border-line-strong hover:bg-paper-mist'
              }`}
            >
              <p className="text-xs font-medium text-ink sm:text-sm">{v.name}</p>
              <p className="mt-0.5 text-[10px] text-ink-faint">{v.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Riders */}
      <div className="card p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium text-ink">
            <Truck size={17} className="text-moss-700" /> Available {vehicleChoice} riders
          </h3>
          <span className="badge-moss shrink-0">{filteredRiders.length} online</span>
        </div>

        {filteredRiders.length > 0 ? (
          <div className="space-y-3">
            {filteredRiders.map((rider) => (
              <div
                key={rider.id}
                className={`flex flex-col items-start justify-between gap-3 rounded-lg border p-3.5 transition-colors sm:flex-row sm:items-center ${
                  assignedRider?.id === rider.id ? 'border-moss bg-moss-50' : 'border-line'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">{rider.name}</span>
                    <span className="badge-neutral uppercase">{rider.vehicle}</span>
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
                    <span className="inline-flex items-center gap-0.5"><MapPin size={11} /> {rider.distanceKm} km away</span>
                    <span>·</span>
                    <span>★ {rider.rating}</span>
                  </p>
                </div>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <a
                    href={getWhatsAppDispatchLink(rider)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => onSelectRider(rider)}
                    className="btn-primary btn-sm flex-1 sm:flex-none"
                  >
                    <MessageSquare size={13} /> WhatsApp
                  </a>
                  <a href={`tel:${rider.phone}`} className="btn-secondary btn-sm">
                    <Phone size={13} /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-ink-faint">
            No active dispatch riders operating a <span className="font-medium text-ink-soft">{vehicleChoice}</span> near your area right now.
          </div>
        )}

        {assignedRider && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gold-200 bg-gold-50 p-3.5 text-xs">
            <div className="flex min-w-0 items-center gap-2">
              <Clock size={18} className="shrink-0 animate-pulse text-gold-700" />
              <div className="min-w-0">
                <p className="truncate font-medium text-gold-700">Rider confirmation: {assignedRider.name}</p>
                <p className="text-[11px] text-ink-soft">Auto-reassigns if unconfirmed in 30 minutes.</p>
              </div>
            </div>
            <span className="rounded bg-gold-100 px-2.5 py-1 font-mono text-sm font-semibold text-gold-700">
              {formatTimer(timerSeconds)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
