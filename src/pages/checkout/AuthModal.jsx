import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

/**
 * The single buyer sign-in / registration surface used at checkout.
 * Note: this is still a mock auth flow (accepts any credentials) pending the
 * real cart/order backend — see project notes. Kept as one component instead
 * of being duplicated inline in CheckoutPage.
 */
export default function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [authMode, setAuthMode] = useState('login');

  const [loginInput, setLoginInput] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin({ input: loginInput, pass: loginPass });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegister({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      password: regPassword,
    });
  };

  return (
    <div className="max-w-md mx-auto card p-6 sm:p-8 space-y-6 animate-rise-in">
      {onClose && (
        <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-ink-faint hover:bg-paper-mist hover:text-ink cursor-pointer">
          <X size={18} />
        </button>
      )}

      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-moss-50 text-moss-700">
          <Lock size={22} />
        </div>
        <h2 className="font-display text-xl font-semibold text-ink">
          {authMode === 'login' ? 'Sign in to continue' : 'Create your buyer account'}
        </h2>
        <p className="mt-1 text-xs text-ink-faint">
          {authMode === 'login' ? 'Sign in to complete checkout securely.' : 'Register to unlock 7-day escrow buyer protection.'}
        </p>
      </div>

      <div className="flex rounded-lg bg-paper-mist p-1 text-xs font-medium">
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className={`flex-1 rounded py-2 transition-colors cursor-pointer ${authMode === 'login' ? 'bg-paper shadow-sm text-moss-700' : 'text-ink-faint'}`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className={`flex-1 rounded py-2 transition-colors cursor-pointer ${authMode === 'register' ? 'bg-paper shadow-sm text-moss-700' : 'text-ink-faint'}`}
        >
          Register
        </button>
      </div>

      {authMode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="field-label">Email or phone number</label>
            <input type="text" required value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="e.g. buyer@example.com" className="input" />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input type="password" required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" className="input" />
          </div>
          <button type="submit" className="btn-primary w-full">Sign in & continue checkout</button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-3">
          <div>
            <label className="field-label">Full name *</label>
            <input type="text" required value={regFullName} onChange={(e) => setRegFullName(e.target.value)} placeholder="e.g. Chinedu Adeleke" className="input" />
          </div>
          <div>
            <label className="field-label">Email address *</label>
            <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="buyer@example.com" className="input" />
          </div>
          <div>
            <label className="field-label">Phone number *</label>
            <input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="08012345678" className="input" />
          </div>
          <div>
            <label className="field-label">Delivery address *</label>
            <input type="text" required value={regAddress} onChange={(e) => setRegAddress(e.target.value)} placeholder="Street name, city, state" className="input" />
          </div>
          <div>
            <label className="field-label">Password *</label>
            <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••••" className="input" />
          </div>
          <button type="submit" className="btn-primary w-full mt-1">Create account & complete order</button>
        </form>
      )}
    </div>
  );
}
