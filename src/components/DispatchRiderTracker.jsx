import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RotateCw, MapPin, Flag, Truck, ArrowLeft, TriangleAlert } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { formatNaira } from './ui/Price';
import { calculateGpsDistanceKm, calculateShippingCost } from '../utils/distanceCalculator';

export default function DispatchRiderTracker({ order: orderProp, activeVendor, onVendorLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Falls back to whatever CheckoutPage handed off via route state
  // (`navigate('/tracker', { state: { orderId, cartItems, deliveryAddress } })`)
  // since there's no orders backend yet to fetch this by ID.
  const order = orderProp || location.state || null;

  const [riderCoords, setRiderCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  const vendorCoords = order?.vendorCoords || { lat: 6.4531, lng: 3.3958 }; // Alaba / Lagos Island market
  const customerCoords = order?.customerCoords || { lat: 6.5244, lng: 3.3792 }; // Ikeja / Yaba area

  const fetchRiderLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser or device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRiderCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setGpsError(null);
      },
      () => setGpsError('Unable to acquire live GPS location. Please enable location permissions.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchRiderLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const riderToVendorKm = riderCoords
    ? calculateGpsDistanceKm(riderCoords.lat, riderCoords.lng, vendorCoords.lat, vendorCoords.lng)
    : 0;

  const vendorToCustomerKm = calculateGpsDistanceKm(vendorCoords.lat, vendorCoords.lng, customerCoords.lat, customerCoords.lng);

  const productWeightKg = order?.weightKg || 2.5;
  const ratePerKgPerKm = 50;
  const totalShippingFee = calculateShippingCost({ weightKg: productWeightKg, distanceKm: vendorToCustomerKm, ratePerKgPerKm });

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar activeVendor={activeVendor} onVendorLogout={onVendorLogout} cartCount={0} />

      <div className="container-page flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-xl">
          <button type="button" onClick={() => navigate('/marketplace')} className="btn-ghost btn-sm mb-4 -ml-2">
            <ArrowLeft size={14} /> Back to marketplace
          </button>

          <div className="card p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                <Truck size={20} className="text-moss-700" /> Rider GPS tracker
              </h3>
              {order?.orderId && <span className="badge-neutral font-mono">{order.orderId}</span>}
            </div>

            {gpsError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-clay-50 p-3 text-xs text-clay-600">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" /> {gpsError}
              </div>
            )}

            <div className="mb-4 flex items-center justify-between rounded-lg bg-paper-mist p-3">
              <div>
                <span className="block text-[11px] text-ink-faint">Rider live coordinates</span>
                <strong className="font-mono text-sm text-ink">
                  {riderCoords ? `${riderCoords.lat.toFixed(4)}, ${riderCoords.lng.toFixed(4)}` : 'Acquiring GPS signal…'}
                </strong>
              </div>
              <button type="button" onClick={fetchRiderLocation} className="btn-secondary btn-sm">
                <RotateCw size={13} /> Refresh
              </button>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-ink-faint"><MapPin size={12} /> Rider → vendor pickup</div>
                <div className="mt-1 font-display text-lg font-semibold text-ink">{riderToVendorKm} km away</div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${vendorCoords.lat},${vendorCoords.lng}`}
                  target="_blank" rel="noreferrer"
                  className="mt-1.5 inline-block text-xs font-medium text-moss-700 hover:underline"
                >
                  Navigate to pickup
                </a>
              </div>
              <div className="rounded-lg border border-line p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-ink-faint"><Flag size={12} /> Vendor → customer dropoff</div>
                <div className="mt-1 font-display text-lg font-semibold text-ink">{vendorToCustomerKm} km away</div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${customerCoords.lat},${customerCoords.lng}`}
                  target="_blank" rel="noreferrer"
                  className="mt-1.5 inline-block text-xs font-medium text-moss-700 hover:underline"
                >
                  Navigate to delivery
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-moss-200 bg-moss-50 p-4">
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-moss-700">Shipping calculation</h4>
              <div className="space-y-1 text-xs text-ink-soft">
                <div className="flex justify-between"><span>Package weight</span><span className="font-medium text-ink">{productWeightKg} kg</span></div>
                <div className="flex justify-between"><span>Delivery distance</span><span className="font-medium text-ink">{vendorToCustomerKm} km</span></div>
                <div className="flex justify-between"><span>Rate per kg/km</span><span className="font-medium text-ink">{formatNaira(ratePerKgPerKm)}</span></div>
                <div className="mt-2 flex justify-between border-t border-moss-200 pt-2 text-sm font-semibold text-moss-700">
                  <span>Total delivery fee</span><span>{formatNaira(totalShippingFee)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
