import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, TriangleAlert } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function VendorLogin({ onLogin }) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter both username/phone and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    const result = await onLogin(identifier, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message || 'Invalid credentials or shop verification is still pending by BravoMart Admin.');
      return;
    }

    navigate('/AdminAiAssistant');
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar cartCount={0} />

      <div className="container-page flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-md">
          <Link to="/marketplace" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
            <ArrowLeft size={14} /> Back to BravoMart
          </Link>

          <div className="card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">Vendor sign in</h2>
                <p className="text-xs text-ink-faint">Access your store dashboard and AI listing tools.</p>
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-lg bg-clay-50 p-3 text-xs text-clay-600">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="field-label">Username or phone</label>
                <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter username or phone" className="input" required />
              </div>
              <div>
                <label className="field-label">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input" required />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Signing in…' : 'Log in to account'}
              </button>
            </form>

            <div className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-soft">
              Want to sell on BravoMart?{' '}
              <Link to="/vendor_register" className="font-medium text-moss-700 hover:underline">Create your shop</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
