import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import AboutUs from './pages/AboutUs';
import AccountPage from './pages/AccountPage';
import AdminAiAssistant from './pages/AdminAiAssistant';
import BravoAdmin from './pages/BravoAdmin';
import BravoSuperAdmin from './pages/BravoSuperAdmin';
import CheckoutPage from './pages/CheckoutPage';
import DispatcherPortal from './pages/DispatcherPortal';
import Help from './pages/Help';
import VendorLogin from './pages/VendorLogin';
import VendorRegister from './pages/VendorRegister';

// Components
import DispatchRiderTracker from './components/DispatchRiderTracker';

// Real backend auth — this is the AI integration's prerequisite: the AI
// endpoint requires a logged-in vendor's access token, so App.jsx is now
// where that real session (not mock state) lives.
import { loginVendor, logoutSession, refreshSession, fetchCurrentUser, ApiError } from './services/api';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [activeVendor, setActiveVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [pendingVendorsCount, setPendingVendorsCount] = useState(3);
  // Shared buyer account — previously AccountPage.jsx called `setUserAccount`
  // with no such prop ever passed in, which threw on every login/register
  // submit. CheckoutPage now shares this same state instead of keeping its
  // own separate copy, so signing in once carries across the app.
  const [userAccount, setUserAccount] = useState(null);
  // True once the on-load silent-refresh attempt (below) has finished, one
  // way or another — lets pages avoid flashing a "please log in" state
  // before we've even checked whether a session cookie still exists.
  const [sessionChecked, setSessionChecked] = useState(false);

  // Maps the backend's user shape onto the fields AdminAiAssistant.jsx's
  // existing UI already reads (shopName, fullName, shopAddress, walletId,
  // walletBalance, coords) — see VendorLogin.jsx / AdminAiAssistant.jsx for
  // the corresponding read side of this shape. Declared before the effect
  // below (rather than relying on function-declaration hoisting) so it's
  // unambiguous this doesn't change between renders.
  const toActiveVendorShape = (user, accessToken) => {
    const vendorProfile = user.vendorProfile;
    return {
      id: user.id,
      accessToken,
      role: user.role,
      fullName: user.fullName,
      shopName: vendorProfile?.shopName || user.fullName,
      shopAddress: vendorProfile?.shopAddress || '',
      walletId: vendorProfile?.id ? `BW-${vendorProfile.id.slice(0, 8).toUpperCase()}` : '—',
      walletBalance: vendorProfile ? Number(vendorProfile.walletBalance) : 0,
      coords: { lat: 6.4531, lng: 3.3958 }, // registered shop GPS isn't collected by the backend yet
    };
  };

  // On first load (including a hard page refresh), the in-memory
  // `activeVendor` state above is gone, but the httpOnly refresh-token
  // cookie the backend set on a previous login may still be valid for up
  // to 30 days. Silently try to trade it for a new access token so the
  // vendor doesn't have to log in again every time they reload the page.
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { accessToken } = await refreshSession();
        const user = await fetchCurrentUser(accessToken);
        if (isMounted) {
          setActiveVendor(toActiveVendorShape(user, accessToken));
        }
      } catch {
        // No valid session cookie (or it expired) — that's a normal,
        // expected outcome the first time anyone visits, not an error.
      } finally {
        if (isMounted) setSessionChecked(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Passed to VendorLogin.jsx as `onLogin` — matches the async
  // (identifier, password) => { success, message } contract that page
  // expects, but now backed by a real POST /api/auth/login call instead of
  // a hardcoded true/false.
  const handleVendorLogin = async (identifier, password) => {
    try {
      const { user, accessToken } = await loginVendor(identifier, password);
      setActiveVendor(toActiveVendorShape(user, accessToken));
      return { success: true };
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Could not reach the server. Please try again.';
      return { success: false, message };
    }
  };

  const handleVendorLogout = async () => {
    if (activeVendor?.accessToken) {
      await logoutSession(activeVendor.accessToken).catch(() => {});
    }
    setActiveVendor(null);
  };

  // Handlers for vendor product lifecycle
  const handleAddProduct = (newProduct) => {
    setVendorProducts((prev) => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId) => {
    setVendorProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateStock = (productId, newStock) => {
    setVendorProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: newStock } : p))
    );
  };

  return (
    <Router basename="/bravomart-frontend">
      <div className="min-h-screen bg-paper text-ink font-sans">
        
        {/* APPLICATION ROUTES */}
        <Routes>
          {/* Main Authentic Homepage */}
          <Route
            path="/"
            element={
              <Home
                activeVendor={activeVendor}
                onVendorLogout={handleVendorLogout}
                cartCount={cartItems.length}
              />
            }
          />

          {/* E-Commerce Marketplace Route */}
          <Route 
            path="/marketplace" 
            element={
              <Marketplace 
                activeVendor={activeVendor}
                onVendorLogout={handleVendorLogout}
                cartItems={cartItems} 
                setCartItems={setCartItems} 
              />
            } 
          />

          {/* Individual Page Routes */}
          <Route path="/account" element={<AccountPage userAccount={userAccount} setUserAccount={setUserAccount} activeVendor={activeVendor} onVendorLogout={handleVendorLogout} cartCount={cartItems.length} />} />
          <Route path="/login" element={<AccountPage userAccount={userAccount} setUserAccount={setUserAccount} activeVendor={activeVendor} onVendorLogout={handleVendorLogout} cartCount={cartItems.length} />} />
          
          <Route path="/vendor_login" element={<VendorLogin onLogin={handleVendorLogin} />} />
          <Route path="/vendor_register" element={<VendorRegister />} />
          <Route path="/sell" element={<VendorRegister />} />

          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cartItems={cartItems}
                setCartItems={setCartItems}
                activeVendor={activeVendor}
                onVendorLogout={handleVendorLogout}
                userAccount={userAccount}
                setUserAccount={setUserAccount}
              />
            }
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/help" element={<Help />} />

          {/* Admin & Portal Routes */}
          <Route path="/BravoAdmin" element={<BravoAdmin />} />
          
          <Route 
            path="/BravoSuperAdmin" 
            element={
              <BravoSuperAdmin 
                pendingVendorsCount={pendingVendorsCount}
                setPendingVendorsCount={setPendingVendorsCount}
                vendorProducts={vendorProducts}
              />
            } 
          />
          
          <Route 
            path="/AdminAiAssistant" 
            element={
              <AdminAiAssistant 
                activeVendor={activeVendor}
                sessionChecked={sessionChecked}
                vendorProducts={vendorProducts}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateStock={handleUpdateStock}
                onLogout={handleVendorLogout}
              />
            } 
          />
          
          <Route path="/DispatcherPortal" element={<DispatcherPortal />} />
          <Route
            path="/tracker"
            element={<DispatchRiderTracker activeVendor={activeVendor} onVendorLogout={handleVendorLogout} />}
          />

          {/* Fallback for unknown URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}