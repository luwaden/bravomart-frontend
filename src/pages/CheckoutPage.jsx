import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, UserCheck, CheckCircle2, Truck, CreditCard, Building2, ArrowLeft } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSummary from './checkout/CartSummary';
import DispatchConfigurator from './checkout/DispatchConfigurator';
import AuthModal from './checkout/AuthModal';

// Base rate per kg per km in NGN.
const BASE_RATE_PER_KG_PER_KM = 50;

// Available dispatch riders catalog (mock — no dispatch backend yet).
const AVAILABLE_RIDERS = [
  { id: 'RIDER-101', name: 'Tunde Bakare', phone: '2348031112233', distanceKm: 0.8, vehicle: 'motorcycle', rating: 4.9 },
  { id: 'RIDER-102', name: 'Emeka Okafor', phone: '2348054445566', distanceKm: 1.4, vehicle: 'van', rating: 4.8 },
  { id: 'RIDER-103', name: 'Sani Musa', phone: '2348029998877', distanceKm: 2.1, vehicle: 'truck', rating: 5.0 },
  { id: 'RIDER-104', name: 'Kemi Adeleke', phone: '2348011223344', distanceKm: 0.5, vehicle: 'motorcycle', rating: 4.7 },
  { id: 'RIDER-105', name: 'Buchi Nnamdi', phone: '2348099887766', distanceKm: 3.0, vehicle: 'car', rating: 4.9 },
];

export default function CheckoutPage({
  cartItems = [],
  setCartItems = () => {},
  activeVendor,
  onVendorLogout,
  userAccount: userAccountProp,
  setUserAccount: setUserAccountProp,
}) {
  const navigate = useNavigate();

  // Fall back to local state when the app hasn't wired a shared user-account
  // store in yet (there's no real buyer-auth backend behind this today).
  const [localUserAccount, setLocalUserAccount] = useState(null);
  const userAccount = userAccountProp !== undefined ? userAccountProp : localUserAccount;
  const setUserAccount = setUserAccountProp || setLocalUserAccount;

  const [vehicleChoice, setVehicleChoice] = useState('motorcycle');
  const [deliveryAddress, setDeliveryAddress] = useState(
    userAccount?.primaryDeliveryAddress || 'Plot 15, Admiralty Way, Lekki Phase 1, Lagos'
  );

  const [assignedRider, setAssignedRider] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(1800);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null); // 'card' | 'transfer'

  const filteredRiders = AVAILABLE_RIDERS.filter((r) => r.vehicle === vehicleChoice);

  useEffect(() => {
    if (userAccount?.primaryDeliveryAddress) {
      setDeliveryAddress(userAccount.primaryDeliveryAddress);
    }
  }, [userAccount]);

  // Countdown timer for rider confirmation, with auto-reassignment.
  useEffect(() => {
    let countdownInterval;
    if (isTimerActive && timerSeconds > 0) {
      countdownInterval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      setIsTimerActive(false);
      if (filteredRiders.length > 0) setAssignedRider(filteredRiders[0]);
      setTimerSeconds(1800);
      setIsTimerActive(true);
    }
    return () => clearInterval(countdownInterval);
  }, [isTimerActive, timerSeconds, filteredRiders]);

  const pickupLocations = Array.from(
    new Set(cartItems.map((item) => item.vendorAddress || item.pickupAddress || 'Central Marketplace Warehouse, Lagos'))
  );

  const isMultiPickup = pickupLocations.length > 1;
  const ratePerKgKm = isMultiPickup ? BASE_RATE_PER_KG_PER_KM * 0.95 : BASE_RATE_PER_KG_PER_KM;

  const calculateItemDistance = (item) => Math.max(1, item.distanceKm || 8.5);
  const calculateItemShippingFee = (item) => {
    const dist = calculateItemDistance(item);
    const weight = item.weightKg || 1;
    return Math.round(dist * weight * ratePerKgKm);
  };

  const totalShippingFee = cartItems.reduce((acc, item) => acc + calculateItemShippingFee(item), 0);
  const productsTotal = cartItems.reduce((acc, item) => acc + ((item.salePrice || 15000) * (item.quantity || 1)), 0);
  const platformFee = Math.round((productsTotal + totalShippingFee) * 0.03);
  const grandTotal = productsTotal + totalShippingFee + platformFee;

  const handleUpdateQuantity = (index, delta) => {
    const updated = [...cartItems];
    const newQty = (updated[index].quantity || 1) + delta;
    if (newQty >= 1) {
      updated[index] = { ...updated[index], quantity: newQty };
      setCartItems(updated);
    }
  };

  const handleRemoveItem = (index) => setCartItems(cartItems.filter((_, i) => i !== index));

  // Mock buyer auth — accepts any credentials (no real backend behind this).
  const handleLoginSubmit = ({ input }) => {
    const extractedName = input.includes('@') ? input.split('@')[0] : input || 'Test Buyer';
    setUserAccount({
      fullName: extractedName.charAt(0).toUpperCase() + extractedName.slice(1),
      email: input || 'testbuyer@bravomart.com',
      primaryDeliveryAddress: deliveryAddress,
    });
  };

  const handleRegisterSubmit = ({ fullName, email, address }) => {
    setUserAccount({
      fullName: fullName || 'New Test Buyer',
      email: email || 'newbuyer@bravomart.com',
      primaryDeliveryAddress: address || deliveryAddress,
    });
    if (address) setDeliveryAddress(address);
  };

  const handleFinalPayment = () => {
    if (cartItems.length === 0) return;
    const random10Digits = Math.floor(1000000000 + Math.random() * 9000000000);
    setPlacedOrderId('B' + random10Digits);
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar activeVendor={activeVendor} onVendorLogout={onVendorLogout} cartCount={cartItems.length} />

      <div className="container-page flex-1 py-6 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <h1 className="flex items-center gap-2 font-display text-xl font-semibold text-ink sm:text-2xl">
            <ShoppingBag className="shrink-0 text-moss-700" size={22} />
            Checkout & dispatch
          </h1>
          <button type="button" onClick={() => navigate('/marketplace')} className="btn-secondary btn-sm">
            <ArrowLeft size={14} /> Back to store
          </button>
        </div>

        {placedOrderId ? (
          <div className="mx-auto max-w-md space-y-4 card p-8 text-center animate-scale-in">
            <CheckCircle2 size={40} className="mx-auto text-moss-600" />
            <h2 className="font-display text-2xl font-semibold text-ink">Order placed!</h2>
            <p className="text-xs text-ink-faint">
              Payment method: <span className="font-medium uppercase text-ink">{selectedPaymentMethod}</span>
            </p>
            <div className="rounded-lg bg-ink p-4 text-xs">
              <span className="block text-[10px] text-white/50">Tracking ID</span>
              <span className="font-display text-xl font-semibold text-gold-200">{placedOrderId}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/tracker', { state: { orderId: placedOrderId, cartItems, deliveryAddress } })}
              className="btn-primary w-full"
            >
              <Truck size={16} /> Track order
            </button>
          </div>
        ) : !userAccount ? (
          <AuthModal isOpen onLogin={handleLoginSubmit} onRegister={handleRegisterSubmit} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <DispatchConfigurator
                pickupLocations={pickupLocations}
                isMultiPickup={isMultiPickup}
                deliveryAddress={deliveryAddress}
                setDeliveryAddress={setDeliveryAddress}
                userAccount={userAccount}
                vehicleChoice={vehicleChoice}
                setVehicleChoice={setVehicleChoice}
                filteredRiders={filteredRiders}
                assignedRider={assignedRider}
                onSelectRider={(rider) => { setAssignedRider(rider); setTimerSeconds(1800); setIsTimerActive(true); }}
                timerSeconds={timerSeconds}
                formatTimer={(sec) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`}
                getWhatsAppDispatchLink={(rider) => `https://wa.me/${rider.phone}`}
              />
            </div>

            <div className="space-y-4 lg:col-span-5">
              <CartSummary
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                calculateItemShippingFee={calculateItemShippingFee}
                calculateItemDistance={calculateItemDistance}
                productsTotal={productsTotal}
                totalShippingFee={totalShippingFee}
                platformFee={platformFee}
                grandTotal={grandTotal}
                isMultiPickup={isMultiPickup}
              />

              <div className="flex items-center justify-between rounded-lg border border-moss-200 bg-moss-50 p-3 text-xs font-medium text-moss-700">
                <span className="flex items-center gap-1.5"><UserCheck size={15} /> Signed in as {userAccount.fullName}</span>
                <button type="button" onClick={() => setUserAccount(null)} className="text-[11px] text-clay hover:underline cursor-pointer">
                  Switch account
                </button>
              </div>

              <div className="card space-y-3 p-4">
                <h3 className="text-xs font-medium text-ink">How would you like to pay?</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors cursor-pointer ${
                      selectedPaymentMethod === 'card' ? 'border-moss bg-moss-50 text-moss-700' : 'border-line text-ink-soft hover:bg-paper-mist'
                    }`}
                  >
                    <CreditCard size={18} /> Pay with card
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('transfer')}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors cursor-pointer ${
                      selectedPaymentMethod === 'transfer' ? 'border-moss bg-moss-50 text-moss-700' : 'border-line text-ink-soft hover:bg-paper-mist'
                    }`}
                  >
                    <Building2 size={18} /> Bank transfer
                  </button>
                </div>

                {selectedPaymentMethod && (
                  <button type="button" onClick={() => handleFinalPayment(selectedPaymentMethod)} className="btn-primary w-full">
                    <ShieldCheck size={18} /> Complete {selectedPaymentMethod === 'card' ? 'card payment' : 'bank transfer'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
