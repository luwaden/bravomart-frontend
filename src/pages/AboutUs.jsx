import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Users, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PILLARS = [
  { icon: ShieldCheck, title: '7-day escrow protection', body: 'Your money is never released to the seller until you inspect and accept your items, keeping shopping scam-free.' },
  { icon: Truck, title: 'Verified logistics', body: 'BravoMart dispatchers verify item condition before delivering to your doorstep, with live GPS tracking on the way.' },
  { icon: Users, title: 'Local & global vendors', body: 'From farm produce like garri and yam to heavy machinery and solar tech, we support vendors of every scale.' },
];

const STATS = [
  { value: '100%', label: 'Escrow secured' },
  { value: '7 days', label: 'Inspection window' },
  { value: '24/7', label: 'AI scam defense' },
  { value: 'Verified', label: 'Dispatch fleet' },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar cartCount={0} />

      <div className="container-page flex-1 space-y-12 py-8 sm:py-12">
        <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">About BravoMart</h1>
            <p className="mt-1 text-sm text-ink-soft">Connecting shoppers, vendors, and trusted logistics, safely.</p>
          </div>
          <button type="button" onClick={() => navigate('/marketplace')} className="btn-secondary w-full sm:w-auto">
            <ArrowLeft size={14} /> Back to store
          </button>
        </div>

        <section className="card p-6 sm:p-12">
          <div className="max-w-2xl space-y-3">
            <span className="badge-moss">Empowering modern commerce</span>
            <h2 className="font-display text-2xl font-semibold leading-tight text-ink sm:text-4xl">
              Reinventing Nigerian e-commerce with trust and speed.
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              BravoMart is built to solve trust in online trade. By combining 7-day escrow protection,
              AI-assisted scam scanning, and verified dispatch logistics, every transaction stays safe
              for buyers and profitable for vendors.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card space-y-3 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-moss-50 text-moss-700">
                <Icon size={20} />
              </div>
              <h3 className="text-base font-medium text-ink">{title}</h3>
              <p className="text-xs leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </section>

        <section className="card grid grid-cols-2 gap-6 p-6 text-center sm:p-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-semibold text-moss-700 sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-ink-faint">{s.label}</div>
            </div>
          ))}
        </section>

        <section className="rounded-xl bg-ink px-6 py-8 text-center text-white sm:px-8">
          <h3 className="font-display text-xl font-semibold sm:text-2xl">Ready to shop with peace of mind?</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/70">
            Browse verified listings from trusted vendors across Nigeria.
          </p>
          <button type="button" onClick={() => navigate('/marketplace')} className="btn-primary mt-4 inline-flex">
            Explore marketplace
          </button>
        </section>
      </div>

      <Footer />
    </div>
  );
}
