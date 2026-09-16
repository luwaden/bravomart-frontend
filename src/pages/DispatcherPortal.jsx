import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Lock, Clock, Power, ArrowLeft } from 'lucide-react';

const VEHICLE_OPTIONS = [
  { value: 'motorcycle', label: 'Motorcycle / bike' },
  { value: 'tricycle', label: 'Tricycle (Keke)' },
  { value: 'car', label: 'Sedan / car' },
  { value: 'van', label: 'Delivery van' },
  { value: 'truck', label: 'Heavy duty truck' },
];

export default function DispatcherPortal({ activeRider: activeRiderProp, setActiveRider: setActiveRiderProp }) {
  const navigate = useNavigate();

  // Falls back to local state — there's no dispatcher backend or shared
  // rider session yet, and the props were never actually wired from App.jsx
  // (calling the missing setter used to throw on every submit).
  const [localActiveRider, setLocalActiveRider] = useState(null);
  const activeRider = activeRiderProp !== undefined ? activeRiderProp : localActiveRider;
  const setActiveRider = setActiveRiderProp || setLocalActiveRider;

  const [mode, setMode] = useState(activeRider ? (activeRider.isApproved ? 'dashboard' : 'pending_verification') : 'register');

  const [fullName, setFullName] = useState('');
  const [currentResidentialAddress, setCurrentResidentialAddress] = useState('');
  const [permanentHomeAddress, setPermanentHomeAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('motorcycle');
  const [initialVehicleRegNum, setInitialVehicleRegNum] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (activeRider) {
      setMode(activeRider.isApproved ? 'dashboard' : 'pending_verification');
      setIsAvailable(activeRider.isAvailable ?? true);
    }
  }, [activeRider]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName || !currentResidentialAddress || !permanentHomeAddress || !phoneNumber || !username || !password || !initialVehicleRegNum) {
      setFormError('Please fill in all required fields marked with (*).');
      return;
    }
    setFormError('');

    setActiveRider({
      id: 'RIDER-' + Math.floor(100000 + Math.random() * 900000),
      fullName,
      currentResidentialAddress,
      permanentHomeAddress,
      phoneNumber,
      username,
      isApproved: false,
      vehicleHistory: [{ regNumber: initialVehicleRegNum.toUpperCase(), type: vehicleType, dateAdded: new Date().toLocaleDateString(), isCurrent: true }],
      walletNaira: 0,
      isAvailable: false,
    });
    setMode('pending_verification');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginUser.trim() || !loginPass.trim()) return;

    setActiveRider({
      id: 'RIDER-992014',
      fullName: `${loginUser} (verified dispatcher)`,
      currentResidentialAddress: '12 Admiralty Way, Lekki Phase 1, Lagos',
      permanentHomeAddress: 'Compound 4, Umudike, Abia State',
      phoneNumber: '08039948821',
      isApproved: true,
      vehicleHistory: [
        { regNumber: 'LAG-882-AB', type: 'motorcycle', dateAdded: '01/02/2026', isCurrent: true },
        { regNumber: 'KJA-104-XY', type: 'motorcycle', dateAdded: '15/05/2024', isCurrent: false },
      ],
      walletNaira: 74500,
      isAvailable: true,
    });
    setMode('dashboard');
  };

  return (
    <div className="min-h-screen bg-paper-mist py-8 px-4 font-sans">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-moss p-2.5 text-white">
              <Truck size={24} />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">BravoMart dispatcher portal</h1>
              <p className="text-xs text-ink-faint">Verified logistics & delivery network</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            {activeRider && (
              <button type="button" onClick={() => { setActiveRider(null); setMode('register'); }} className="btn-secondary btn-sm flex-1 border-clay-100 text-clay hover:bg-clay-50 sm:flex-none">
                Log out
              </button>
            )}
            <button type="button" onClick={() => navigate('/')} className="btn-secondary btn-sm flex-1 sm:flex-none">
              <ArrowLeft size={14} /> Homepage
            </button>
          </div>
        </div>

        {mode === 'register' && (
          <div className="card overflow-hidden">
            <div className="bg-moss p-6 text-white">
              <h2 className="flex items-center gap-2 text-lg font-medium">
                <ShieldCheck size={22} className="text-gold-200" /> Apply to become a Bravo dispatcher
              </h2>
              <p className="mt-1 text-xs text-white/70">Submit your verification details. Admin approval is required before account activation.</p>
            </div>

            <form onSubmit={handleRegister} className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              {formError && (
                <div className="col-span-2 rounded-lg bg-clay-50 p-3 text-xs text-clay-600">{formError}</div>
              )}

              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Full name (as shown on national ID) *</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Chukwuma Emmanuel" className="input" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Contact phone number *</label>
                <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="08012345678" className="input" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Current residential address *</label>
                <input type="text" required value={currentResidentialAddress} onChange={(e) => setCurrentResidentialAddress(e.target.value)} placeholder="Current street address, LGA, state" className="input" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Permanent home address *</label>
                <input type="text" required value={permanentHomeAddress} onChange={(e) => setPermanentHomeAddress(e.target.value)} placeholder="Village / family compound, state of origin" className="input" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Vehicle category *</label>
                <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="input bg-paper">
                  {VEHICLE_OPTIONS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Vehicle registration number *</label>
                <input type="text" required value={initialVehicleRegNum} onChange={(e) => setInitialVehicleRegNum(e.target.value)} placeholder="e.g. LAG-482-XA" className="input font-mono uppercase" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Upload ID document *</label>
                <input type="file" required className="text-xs text-ink-soft file:mr-2 file:rounded file:border-0 file:bg-moss-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-moss-700" />
              </div>

              <div className="col-span-2 mt-2 border-t border-line pt-3">
                <h3 className="mb-2 text-xs font-medium text-ink">Create security credentials</h3>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Create username *</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. rider_emmanuel" className="input" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="field-label">Create password *</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input" />
              </div>

              <div className="col-span-2 mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <ShieldCheck size={16} /> Submit for physical verification
                </button>
                <button type="button" onClick={() => setMode('login')} className="text-xs font-medium text-moss-700 hover:underline cursor-pointer">
                  Already registered? Log in →
                </button>
              </div>
            </form>
          </div>
        )}

        {mode === 'pending_verification' && (
          <div className="mx-auto max-w-lg card space-y-4 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-700">
              <Clock size={30} className="animate-pulse" />
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">Application under physical verification</h2>
            <p className="text-sm leading-relaxed text-ink-soft">
              Thank you, <b className="text-ink">{activeRider?.fullName}</b>. Your details are under review by the BravoMart verification team.
            </p>
            <button
              type="button"
              onClick={() => setActiveRider({ ...activeRider, isApproved: true })}
              className="btn-secondary"
            >
              [Demo] Simulate admin approval
            </button>
          </div>
        )}

        {mode === 'login' && (
          <div className="mx-auto max-w-md card overflow-hidden">
            <div className="bg-ink p-6 text-white">
              <h2 className="flex items-center gap-2 text-base font-medium"><Lock size={18} /> Dispatcher login</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 p-6">
              <div>
                <label className="field-label">Username / phone</label>
                <input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="input" />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="input" />
              </div>
              <button type="submit" className="btn-primary w-full">Access rider dashboard</button>
            </form>
          </div>
        )}

        {mode === 'dashboard' && activeRider?.isApproved && (
          <div className="card flex flex-col items-center justify-between gap-4 p-5 md:flex-row">
            <div className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${isAvailable ? 'bg-moss-50 text-moss-700' : 'bg-clay-50 text-clay'}`}>
                <Power size={22} />
              </div>
              <h3 className="text-sm font-medium text-ink">
                Status: {isAvailable ? <span className="font-semibold text-moss-700">Online & available</span> : <span className="font-semibold text-clay">Offline</span>}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className={isAvailable ? 'btn-danger w-full md:w-auto' : 'btn-primary w-full md:w-auto'}
            >
              {isAvailable ? 'Go offline' : 'Go online'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
