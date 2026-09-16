import React from 'react';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
