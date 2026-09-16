import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TriangleAlert, CheckCircle2, UploadCloud } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { registerVendor, ApiError } from '../services/api';

const BUSINESS_TYPES = [
  { value: 'groceries', label: 'Groceries & food' },
  { value: 'electronics', label: 'Electronics & tech' },
  { value: 'fashion', label: 'Fashion & boutique' },
  { value: 'general', label: 'General merchant' },
];

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    fullName: '', homeAddress: '', shopName: '', shopAddress: '',
    businessType: 'retail', phone: '', email: '', username: '', password: '',
    idCardFile: null,
  });

  const [idPreview, setIdPreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, idCardFile: file }));
      setIdPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, homeAddress, shopName, shopAddress, phone, username, password, idCardFile } = formData;
    if (!fullName || !homeAddress || !shopName || !shopAddress || !phone || !username || !password) {
      setError('Please fill in all mandatory fields (including your ID card document).');
      return;
    }
    if (!idCardFile) {
      setError('Uploading a national means of identification is required.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      // Real backend call — POST /api/auth/vendor/register, reviewed by
      // BravoMart admin before the account can log in.
      await registerVendor(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <Navbar cartCount={0} />
        <div className="container-page flex-1 py-14">
          <div className="mx-auto max-w-md space-y-4 card p-8 text-center animate-scale-in">
            <CheckCircle2 size={40} className="mx-auto text-moss-600" />
            <h2 className="font-display text-2xl font-semibold text-ink">Application submitted</h2>
            <p className="text-sm text-ink-soft">
              BravoMart admin will review your shop details and ID within 1–2 business days.
              You'll be able to sign in once your shop is verified.
            </p>
            <Link to="/vendor_login" className="btn-primary inline-flex w-full justify-center">
              Go to vendor sign in
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar cartCount={0} />

      <div className="container-page flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-2xl">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">Register your shop on BravoMart</h2>
            <p className="mt-1.5 text-sm text-ink-soft">
              Fill in your business details below for physical verification by the BravoMart admin team.
            </p>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-lg bg-clay-50 p-3 text-xs text-clay-600">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="field-label">Full name (as shown on national ID) *</label>
                <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. Chukwuma Emmanuel" className="input" />
              </div>

              <div>
                <label className="field-label">Residential home address (admin use only) *</label>
                <textarea rows="2" required value={formData.homeAddress} onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })} placeholder="House number, street, city, state" className="input resize-none" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Shop name *</label>
                  <input type="text" required value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} placeholder="e.g. Bravo Electronics & Logistics" className="input" />
                </div>
                <div>
                  <label className="field-label">Business type *</label>
                  <select value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} className="input bg-paper">
                    {BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">Shop physical address (for customers & dispatch riders) *</label>
                <textarea rows="2" required value={formData.shopAddress} onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })} placeholder="Shop 14, Alaba International Market, Ojo, Lagos" className="input resize-none" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Contact phone number *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="08012345678" className="input" />
                </div>
                <div>
                  <label className="field-label">Email address (optional)</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="vendor@bravomart.com" className="input" />
                </div>
              </div>

              <div>
                <label className="field-label">Means of identification (NIN / voter's card / license / passport) *</label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-line-strong px-4 py-3 text-xs text-ink-soft hover:border-moss hover:bg-paper-mist transition-colors">
                  <UploadCloud size={16} className="text-ink-faint" />
                  {formData.idCardFile ? formData.idCardFile.name : 'Choose a file (image or PDF)'}
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </label>
                {idPreview && (
                  <img src={idPreview} alt="ID preview" className="mt-2 h-36 w-full rounded-lg border border-line object-cover" />
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label">Create login username *</label>
                  <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="bravovendor1" className="input" />
                </div>
                <div>
                  <label className="field-label">Create password *</label>
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="input" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                {isSubmitting ? 'Submitting…' : 'Submit shop application'}
              </button>
            </form>

            <div className="mt-6 border-t border-line pt-5 text-center text-sm text-ink-soft">
              Already have a shop?{' '}
              <Link to="/vendor_login" className="font-medium text-moss-700 hover:underline">Log in</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
