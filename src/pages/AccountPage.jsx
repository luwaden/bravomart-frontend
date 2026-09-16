import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Phone, MapPin, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AccountPage({ userAccount, setUserAccount, activeVendor, onVendorLogout, cartCount = 0 }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setUserAccount({
      fullName: email.split('@')[0] || 'Valued Customer',
      email,
      phone: '08030001122',
      primaryDeliveryAddress: 'Block 4, Lekki Phase 1, Lagos',
      role: 'customer',
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setUserAccount({ fullName, email, phone, primaryDeliveryAddress: address, role: 'customer' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar activeVendor={activeVendor} onVendorLogout={onVendorLogout} cartCount={cartCount} />

      <div className="container-page flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-md space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">My account</h1>
            <button type="button" onClick={() => navigate('/')} className="btn-ghost btn-sm">
              <ArrowLeft size={14} /> Store
            </button>
          </div>

          {userAccount ? (
            <div className="card space-y-6 p-6">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-50 font-display text-xl font-semibold text-moss-700">
                  {userAccount.fullName ? userAccount.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-medium text-ink">{userAccount.fullName}</h3>
                  <p className="truncate text-xs text-ink-faint">{userAccount.email}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-lg bg-paper-mist p-3">
                  <span className="flex items-center gap-2 text-ink-faint"><Phone size={14} /> Phone</span>
                  <span className="font-medium text-ink">{userAccount.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-paper-mist p-3">
                  <span className="flex items-center gap-2 text-ink-faint"><MapPin size={14} /> Address</span>
                  <span className="max-w-[180px] truncate font-medium text-ink">{userAccount.primaryDeliveryAddress || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-moss-200 bg-moss-50 p-3 font-medium text-moss-700">
                  <span className="flex items-center gap-2"><ShieldCheck size={14} /> Account status</span>
                  <span>Verified buyer</span>
                </div>
              </div>

              <button type="button" onClick={() => setUserAccount(null)} className="btn-danger w-full bg-clay-50 text-clay hover:bg-clay-100 hover:text-white">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          ) : (
            <div className="card space-y-5 p-6">
              <div className="flex rounded-lg bg-paper-mist p-1 text-xs font-medium">
                <button type="button" onClick={() => setTab('login')} className={`flex-1 rounded py-2.5 transition-colors cursor-pointer ${tab === 'login' ? 'bg-paper shadow-sm text-ink' : 'text-ink-faint'}`}>
                  Sign in
                </button>
                <button type="button" onClick={() => setTab('register')} className={`flex-1 rounded py-2.5 transition-colors cursor-pointer ${tab === 'register' ? 'bg-paper shadow-sm text-ink' : 'text-ink-faint'}`}>
                  Register
                </button>
              </div>

              {tab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="field-label">Email or phone</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@example.com" className="input pl-9" />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
                      <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input pl-9" />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full">Sign in to account</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="field-label">Full name *</label>
                    <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" className="input" />
                  </div>
                  <div>
                    <label className="field-label">Email address *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" className="input" />
                  </div>
                  <div>
                    <label className="field-label">Phone number *</label>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" className="input" />
                  </div>
                  <div>
                    <label className="field-label">Delivery address *</label>
                    <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state" className="input" />
                  </div>
                  <button type="submit" className="btn-primary w-full mt-1">Create BravoMart account</button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
