import React, { useState, useEffect } from "react";
import { Sparkles, Package, Truck, MapPin, X, Send, Search, RotateCw, TriangleAlert, CheckCircle2, Eye, LogOut } from "lucide-react";

// CHANGED FOR REAL AI INTEGRATION: these three replace the fake
// `setTimeout` generator further down — see handleAiAutoFill().
import { generateAiProductListing, resolveMediaUrl, ApiError } from "../services/api";
import { calculateGpsDistanceKm, calculateShippingCost } from "../utils/distanceCalculator";
import { formatNaira } from "../components/ui/Price";

// Fallback dummy vendor in case activeVendor prop is not passed
const DEFAULT_VENDOR = {
  id: "v-demo-101",
  shopName: "Bravo Mega Store",
  fullName: "Demo Merchant",
  shopAddress: "12 Marina Street, Lagos Island",
  walletId: "BW-990231",
  walletBalance: 150000,
  coords: { lat: 6.4531, lng: 3.3958 },
};

const TABS = [
  { id: "ai_poster", label: "AI listing assistant", icon: Sparkles },
  { id: "my_products", label: "Catalog", icon: Package },
  { id: "dispatch_tracker", label: "GPS dispatch & shipping", icon: Truck },
];

export default function AdminAiAssistant({
  activeVendor = DEFAULT_VENDOR,
  sessionChecked = true,
  vendorProducts = [],
  onAddProduct = () => {},
  onDeleteProduct = () => {},
  onUpdateStock = () => {},
  onLogout = () => {},
}) {
  const vendor = activeVendor || DEFAULT_VENDOR;
  const products = vendorProducts || [];
  // The AI endpoint requires a real, backend-issued access token (see
  // src/services/api.js). `DEFAULT_VENDOR` above has no `accessToken`, so
  // this is false both while the on-load session check is still running
  // and whenever nobody is actually logged in — either way, the AI button
  // stays disabled rather than firing a request that can only ever 401.
  const isVendorAuthenticated = Boolean(activeVendor?.accessToken);

  const [activeTab, setActiveTab] = useState("ai_poster");

  const [productName, setProductName] = useState("");
  const [briefDesc, setBriefDesc] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [productWeight, setProductWeight] = useState("2.5");
  const [photos, setPhotos] = useState([]);
  // CHANGED FOR REAL AI INTEGRATION: `photos` only ever held blob preview
  // URLs (see handlePhotosChange) — the actual File objects were discarded,
  // so there was nothing real to upload. `photoFiles` keeps the real File
  // objects, in the same order as `photos`, so the first one can be sent
  // to the AI endpoint as multipart/form-data.
  const [photoFiles, setPhotoFiles] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoError, setVideoError] = useState("");

  const [condition, setCondition] = useState("brand_new");
  const [acceptsSwap, setAcceptsSwap] = useState(false);

  const [isCustomPickup, setIsCustomPickup] = useState(false);
  const [customPickupAddress, setCustomPickupAddress] = useState("");
  const [customPickupCoords, setCustomPickupCoords] = useState({ lat: 6.4531, lng: 3.3958 });

  const [vendorGps, setVendorGps] = useState(vendor.coords || { lat: 6.4531, lng: 3.3958 });
  const [isCapturingGps, setIsCapturingGps] = useState(false);

  const activePickupAddress = isCustomPickup ? (customPickupAddress || "Custom vendor location") : vendor.shopAddress;
  const activePickupCoords = isCustomPickup ? customPickupCoords : vendorGps;

  const [riderCoords, setRiderCoords] = useState(null);
  const [riderGpsError, setRiderGpsError] = useState("");
  const [simulatedCustomerCoords] = useState({ lat: 6.5244, lng: 3.3792 });
  const [ratePerKgKm, setRatePerKgKm] = useState(50);

  const [activeChatProduct, setActiveChatProduct] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  // CHANGED FOR REAL AI INTEGRATION: surfaces the backend's real error
  // message (rate limited, AI service down, validation failure, etc.)
  // instead of the feature silently doing nothing.
  const [aiError, setAiError] = useState("");

  const openGpsSettingsInstruction = () => {
    alert(
      "To enable GPS permissions:\n\n" +
      "• Android/Chrome: tap the lock icon beside the URL bar → Site settings → Location → Allow.\n" +
      "• iOS/Safari: Settings → Privacy & Security → Location Services → Safari → Allow.\n" +
      "• Windows/Mac: Settings → Privacy → Location → turn on for your browser."
    );
  };

  const handleSearchMarketPrices = () => {
    if (!productName.trim()) {
      alert("Please enter a product name first!");
      return;
    }
    const query = encodeURIComponent(`how much is the price of ${productName.trim()}`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  const handleCaptureVendorGps = (isCustom = false) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser/device.");
      return;
    }
    setIsCapturingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (isCustom) setCustomPickupCoords(coords);
        else setVendorGps(coords);
        setIsCapturingGps(false);
      },
      () => {
        alert("Failed to acquire shop location. Please check device GPS permissions.");
        setIsCapturingGps(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const fetchRiderLocation = () => {
    if (!navigator.geolocation) {
      setRiderGpsError("Geolocation is not supported by your device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setRiderCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setRiderGpsError("");
      },
      () => setRiderGpsError("Unable to acquire live GPS location. Enable GPS permissions."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (activeTab === "dispatch_tracker") fetchRiderLocation();
  }, [activeTab]);

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPreviews]);
    setPhotoFiles((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoError("");
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setVideoError("Video file size exceeds the 10MB limit.");
        setVideo(null);
        return;
      }
      const videoObjectUrl = URL.createObjectURL(file);
      setVideo(videoObjectUrl);
      if (photos.length === 0) extractThumbnailFromVideo(videoObjectUrl);
    }
  };

  const extractThumbnailFromVideo = (videoUrl) => {
    const videoElem = document.createElement("video");
    videoElem.src = videoUrl;
    videoElem.crossOrigin = "anonymous";
    videoElem.currentTime = 1;
    videoElem.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElem.videoWidth || 300;
      canvas.height = videoElem.videoHeight || 200;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
      setPhotos([canvas.toDataURL("image/png")]);
    };
  };

  // CHANGED FOR REAL AI INTEGRATION: this used to be a `setTimeout` that
  // invented data client-side. It now calls the real backend endpoint,
  // POST /api/admin/products/ai-create (see src/services/api.js), which
  // calls Google's Gemini model server-side, saves the result to
  // PostgreSQL, and returns the saved product.
  const handleAiAutoFill = async () => {
    if (!productName && !briefDesc) {
      alert("Please enter a basic product name or brief description first!");
      return;
    }
    if (!isVendorAuthenticated) {
      setAiError("Please log in as a vendor first — the AI Assistant needs a real BravoMart account to save listings to.");
      return;
    }

    setAiError("");
    setIsGenerating(true);
    setIsPublished(false);

    const prompt = [
      productName,
      briefDesc,
      actualPrice ? `Price: ₦${actualPrice}${discountPrice ? ` (discounted to ₦${discountPrice})` : ""}.` : "",
      `Condition: ${condition === "fairly_used" ? "fairly used" : "brand new"}.`,
    ].filter(Boolean).join(" ");

    try {
      const product = await generateAiProductListing({
        prompt,
        imageFile: photoFiles[0],
        weightKg: parseFloat(productWeight) || 1,
        accessToken: activeVendor.accessToken,
      });

      const parsedPrice = Number(product.price) || 0;
      const parsedDiscountPrice = discountPrice
        ? parseFloat(discountPrice.replace(/[^0-9.]/g, "")) || parsedPrice
        : parsedPrice;

      setAiGeneratedData({
        title: product.title,
        description: product.description,
        category: product.category?.name || product.category,
        tags: product.tags,
        originalPrice: Math.round(parsedPrice),
        salePrice: Math.round(parsedDiscountPrice),
        weightKg: parseFloat(productWeight) || 1.0,
        condition,
        acceptsSwap,
        pickupAddress: activePickupAddress,
        vendorCoords: activePickupCoords,
        stockCount: product.inventory,
        rating: 5.0,
        reviewsCount: 1,
        vendorName: vendor.shopName || "Vendor store",
        vendorRating: 4.9,
        image: product.imageUrl ? resolveMediaUrl(product.imageUrl) : photos[0] || null,
        additionalImages: photos,
        videoUrl: video,
        savedProductId: product.id,
      });

      setShowPreviewModal(true);
    } catch (error) {
      setAiError(error instanceof ApiError ? error.message : "Could not reach the AI service. Check your connection and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    if (!aiGeneratedData) return;
    onAddProduct({
      id: aiGeneratedData.savedProductId || `p-vendor-${Date.now()}`,
      vendorId: vendor.id,
      ...aiGeneratedData,
    });
    setIsPublished(true);
    setShowPreviewModal(false);
  };

  const openVendorChat = (product) => {
    setActiveChatProduct(product);
    setChatMessages([
      { sender: "system", text: `Chat started with ${vendor.shopName} regarding "${product.title || product.productName}".` },
      { sender: "vendor", text: `Hello! Thanks for reaching out about ${product.title}. How can I assist you today?` },
    ]);
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: "customer", text: chatInput },
      { sender: "vendor", text: "Thanks for your message! Our team will respond shortly." },
    ]);
    setChatInput("");
  };

  const riderToVendorKm = riderCoords
    ? calculateGpsDistanceKm(riderCoords.lat, riderCoords.lng, activePickupCoords.lat, activePickupCoords.lng)
    : 0;

  const vendorToCustomerKm = calculateGpsDistanceKm(
    activePickupCoords.lat, activePickupCoords.lng,
    simulatedCustomerCoords.lat, simulatedCustomerCoords.lng
  );

  const activeSampleWeight = parseFloat(productWeight) || 2.5;
  const computedShippingFee = calculateShippingCost({
    weightKg: activeSampleWeight,
    distanceKm: vendorToCustomerKm,
    ratePerKgPerKm: ratePerKgKm,
  });

  return (
    <div className="min-h-screen bg-paper-mist p-4 font-sans sm:p-6">
      <div className="mx-auto max-w-5xl">
        {/* Shop banner & wallet */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-ink p-5 text-white">
          <div>
            <h2 className="font-display text-lg font-semibold sm:text-xl">{vendor.shopName} dashboard</h2>
            <p className="mt-1 text-xs text-white/60">Owner: {vendor.fullName} · Default shop: {vendor.shopAddress}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-5 py-3">
            <div className="text-[11px] uppercase tracking-wide text-white/50">Bravo wallet ID</div>
            <div className="font-mono text-sm font-semibold text-gold-200">{vendor.walletId}</div>
            <div className="mt-0.5 text-sm text-moss-300">Balance: <b>{formatNaira(vendor.walletBalance || 0)}</b></div>
          </div>
        </div>

        {sessionChecked && !isVendorAuthenticated ? (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gold-50 p-3.5 text-xs text-gold-700">
            <span className="flex items-center gap-2">
              <TriangleAlert size={15} className="shrink-0" />
              You're viewing this dashboard with sample data. <a href="/vendor_login" className="font-medium underline">Log in as a vendor</a> to use the AI Assistant.
            </span>
          </div>
        ) : isVendorAuthenticated ? (
          <div className="mb-4 flex justify-end">
            <button type="button" onClick={onLogout} className="btn-secondary btn-sm">
              <LogOut size={13} /> Log out ({vendor.fullName})
            </button>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 border-b border-line pb-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === id ? 'bg-moss text-white' : 'bg-paper text-ink-soft border border-line hover:bg-paper-mist'
              }`}
            >
              <Icon size={15} /> {label}
              {id === 'my_products' && <span className="opacity-70">({products.length})</span>}
            </button>
          ))}
        </div>

        {/* Tab 1: AI listing assistant */}
        {activeTab === "ai_poster" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="card space-y-4 p-5">
              <h3 className="font-display text-base font-semibold text-ink">Add new product</h3>

              <div>
                <label className="field-label">Posting store name (auto)</label>
                <input type="text" value={vendor.shopName} disabled className="input bg-paper-mist font-medium" />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="field-label mb-0">Product name *</label>
                  <button type="button" onClick={handleSearchMarketPrices} className="inline-flex items-center gap-1 rounded bg-moss-50 px-2 py-1 text-[11px] font-medium text-moss-700 cursor-pointer">
                    <Search size={11} /> Check price ideas
                  </button>
                </div>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. 5KW hybrid inverter" className="input" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="field-label">Actual price (₦) *</label>
                  <input type="text" value={actualPrice} onChange={(e) => setActualPrice(e.target.value)} placeholder="250000" className="input" />
                </div>
                <div>
                  <label className="field-label">Discount price (₦)</label>
                  <input type="text" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="220000" className="input" />
                </div>
                <div>
                  <label className="field-label">Weight (kg) *</label>
                  <input type="number" step="0.1" value={productWeight} onChange={(e) => setProductWeight(e.target.value)} placeholder="2.5" className="input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Product condition</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input bg-paper">
                    <option value="brand_new">Brand new</option>
                    <option value="fairly_used">Fairly used</option>
                  </select>
                </div>
                <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
                  <input type="checkbox" checked={acceptsSwap} onChange={(e) => setAcceptsSwap(e.target.checked)} className="h-4 w-4 accent-moss" />
                  Accept swap offers?
                </label>
              </div>

              <div className="space-y-2 rounded-lg border border-line bg-paper-mist p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-ink">
                  <MapPin size={13} className="text-moss-700" /> Vendor pickup location for shipping
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
                  <input type="checkbox" checked={isCustomPickup} onChange={(e) => setIsCustomPickup(e.target.checked)} />
                  Shipping from a different location (abroad, warehouse, etc.)
                </label>

                {!isCustomPickup ? (
                  <div className="space-y-1.5">
                    <div className="text-xs text-ink-soft">Shop address: <b className="text-ink">{vendor.shopAddress}</b></div>
                    <div className="font-mono text-[11px] text-moss-700">Lat: {vendorGps.lat.toFixed(4)}, Lng: {vendorGps.lng.toFixed(4)}</div>
                    <button type="button" onClick={() => handleCaptureVendorGps(false)} disabled={isCapturingGps} className="btn-secondary btn-sm">
                      {isCapturingGps ? 'Acquiring…' : 'Recapture shop GPS'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <input type="text" value={customPickupAddress} onChange={(e) => setCustomPickupAddress(e.target.value)} placeholder="Enter custom pickup/dispatch address…" className="input text-xs" />
                    <div className="font-mono text-[11px] text-moss-700">Custom GPS: Lat: {customPickupCoords.lat.toFixed(4)}, Lng: {customPickupCoords.lng.toFixed(4)}</div>
                    <button type="button" onClick={() => handleCaptureVendorGps(true)} disabled={isCapturingGps} className="btn-secondary btn-sm">
                      {isCapturingGps ? 'Acquiring…' : 'Capture custom address GPS'}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="field-label">Brief description</label>
                <textarea rows="2" value={briefDesc} onChange={(e) => setBriefDesc(e.target.value)} placeholder="Key features, warranty, specs…" className="input resize-none" />
              </div>

              <div>
                <label className="field-label">Product photos (up to 5 images)</label>
                <input type="file" accept="image/*" multiple onChange={handlePhotosChange} disabled={photos.length >= 5} className="text-xs text-ink-soft file:mr-2 file:rounded file:border-0 file:bg-moss-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-moss-700" />
                {photos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {photos.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt="preview" className="h-14 w-14 rounded object-cover" />
                        <button type="button" onClick={() => removePhoto(idx)} className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-clay text-[10px] text-white cursor-pointer">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="field-label">Product video (optional, max 10MB)</label>
                <input type="file" accept="video/*" onChange={handleVideoChange} className="text-xs text-ink-soft" />
                {videoError && <p className="mt-1 text-xs text-clay">{videoError}</p>}
                {video && <p className="mt-1 text-xs text-moss-700">Video attached (thumbnail auto-extracted if no images attached)</p>}
              </div>

              <button type="button" onClick={handleAiAutoFill} disabled={isGenerating || !isVendorAuthenticated} className="btn-primary w-full">
                <Sparkles size={16} />
                {isGenerating ? 'Calling Gemini…' : isVendorAuthenticated ? 'Generate listing with AI' : 'Log in as a vendor to use the AI Assistant'}
              </button>
            </div>

            <div className="rounded-lg border-2 border-dashed border-moss-200 bg-paper p-5">
              <h3 className="mb-3 font-display text-base font-semibold text-moss-700">AI generated listing status</h3>

              {!aiGeneratedData && !isGenerating && !aiError && (
                <p className="py-10 text-center text-sm text-ink-faint">
                  {isVendorAuthenticated ? 'Fill in details and click Generate to create the marketplace listing.' : 'Log in as a vendor to use the AI Assistant.'}
                </p>
              )}

              {isGenerating && <p className="py-10 text-center text-sm text-moss-700">Sending your prompt and photo to Gemini…</p>}

              {aiError && !isGenerating && (
                <div className="flex items-start gap-2 rounded-lg bg-clay-50 p-3.5 text-xs text-clay-600">
                  <TriangleAlert size={15} className="mt-0.5 shrink-0" /> {aiError}
                </div>
              )}

              {aiGeneratedData && !isGenerating && (
                <div>
                  {aiGeneratedData.image ? (
                    <img src={aiGeneratedData.image} alt="Preview" className="mb-3 h-44 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="mb-3 flex h-44 w-full items-center justify-center rounded-lg bg-paper-sunk text-xs text-ink-faint">
                      No photo uploaded
                    </div>
                  )}
                  <h4 className="text-sm font-medium text-ink">{aiGeneratedData.title}</h4>
                  <p className="mt-1 text-xs text-ink-soft">{aiGeneratedData.description}</p>

                  <button type="button" onClick={() => setShowPreviewModal(true)} className="btn-secondary btn-sm mt-3 w-full">
                    <Eye size={13} /> Re-open marketplace preview
                  </button>

                  {isPublished ? (
                    <div className="mt-2 rounded-lg bg-moss-50 p-3 text-center text-sm font-medium text-moss-700">
                      Product posted to BravoMart homepage & your store.
                    </div>
                  ) : (
                    <button type="button" onClick={handlePublish} className="btn-primary mt-2 w-full">
                      Confirm & post product
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Catalog */}
        {activeTab === "my_products" && (
          <div className="card p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-ink">Active products in {vendor.shopName}</h3>

            {products.length === 0 ? (
              <p className="text-sm text-ink-faint">No products added yet.</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.title} className="h-14 w-14 shrink-0 rounded object-cover" />
                      <div>
                        <h4 className="text-sm font-medium text-ink">{product.title}</h4>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-moss-700">{formatNaira(product.salePrice)}</span>
                          {product.originalPrice && <span className="text-ink-faint line-through">{formatNaira(product.originalPrice)}</span>}
                          <span className="text-ink-faint">· Weight: {product.weightKg || 1}kg</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-ink-faint">
                          Condition: <b className="text-ink-soft">{product.condition === 'fairly_used' ? 'Fairly used' : 'Brand new'}</b> · Swap: <b className="text-ink-soft">{product.acceptsSwap ? 'Accepted' : 'No'}</b>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openVendorChat(product)} className="btn-secondary btn-sm">Chat</button>
                      <button type="button" onClick={() => onUpdateStock(product.id, (product.stockCount ?? 10) + 5)} className="btn-secondary btn-sm">+5 stock</button>
                      <button type="button" onClick={() => onDeleteProduct(product.id)} className="btn-secondary btn-sm border-clay-100 text-clay hover:bg-clay-50">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Dispatch tracker */}
        {activeTab === "dispatch_tracker" && (
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                <Truck size={18} className="text-moss-700" /> Dispatch rider GPS terminal
              </h3>
              <button type="button" onClick={fetchRiderLocation} className="btn-secondary btn-sm">
                <RotateCw size={13} /> Refresh GPS
              </button>
            </div>

            {riderGpsError && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-clay-50 p-3 text-xs text-clay-600">
                <span className="flex items-center gap-1.5"><TriangleAlert size={14} /> {riderGpsError}</span>
                <button type="button" onClick={openGpsSettingsInstruction} className="btn-secondary btn-sm bg-paper">
                  Open GPS device settings
                </button>
              </div>
            )}

            <div className="mb-5 rounded-lg bg-paper-mist p-4">
              <span className="block text-xs text-ink-faint">Rider device live GPS signal</span>
              <strong className="font-mono text-sm text-ink">
                {riderCoords ? `${riderCoords.lat.toFixed(5)}, ${riderCoords.lng.toFixed(5)}` : 'Acquiring GPS signal…'}
              </strong>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-moss-50 p-4">
                <div className="text-xs font-medium text-moss-700">Step 1 — pickup location</div>
                <div className="my-1.5 font-display text-xl font-semibold text-ink">{riderToVendorKm} km away</div>
                <p className="mb-2.5 text-xs text-ink-soft">Pickup: {activePickupAddress} ({activePickupCoords.lat.toFixed(3)}, {activePickupCoords.lng.toFixed(3)})</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activePickupCoords.lat},${activePickupCoords.lng}`}
                  target="_blank" rel="noreferrer" className="btn-primary btn-sm inline-flex"
                >
                  Navigate to pickup
                </a>
              </div>

              <div className="rounded-lg border border-line bg-paper-mist p-4">
                <div className="text-xs font-medium text-ink-soft">Step 2 — delivery location</div>
                <div className="my-1.5 font-display text-xl font-semibold text-ink">{vendorToCustomerKm} km away</div>
                <p className="mb-2.5 text-xs text-ink-soft">Destination ({simulatedCustomerCoords.lat.toFixed(3)}, {simulatedCustomerCoords.lng.toFixed(3)})</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${simulatedCustomerCoords.lat},${simulatedCustomerCoords.lng}`}
                  target="_blank" rel="noreferrer" className="btn-secondary btn-sm inline-flex"
                >
                  Navigate to dropoff
                </a>
              </div>
            </div>

            <div className="rounded-lg border border-moss-200 bg-moss-50 p-4">
              <h4 className="mb-3 text-sm font-medium text-moss-700">Automated shipping cost engine</h4>

              <div className="mb-4 grid grid-cols-3 gap-3">
                <div>
                  <label className="field-label">Weight (kg)</label>
                  <input type="number" step="0.1" value={productWeight} onChange={(e) => setProductWeight(e.target.value)} className="input" />
                </div>
                <div>
                  <label className="field-label">Distance (km)</label>
                  <input type="text" value={`${vendorToCustomerKm} km`} disabled className="input bg-moss-100 font-medium" />
                </div>
                <div>
                  <label className="field-label">Rate (₦/kg/km)</label>
                  <input type="number" value={ratePerKgKm} onChange={(e) => setRatePerKgKm(Number(e.target.value))} className="input" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-moss-200 bg-paper p-3.5">
                <div>
                  <div className="text-xs text-moss-700">Formula: {activeSampleWeight}kg × {vendorToCustomerKm}km × {formatNaira(ratePerKgKm)}</div>
                  <div className="text-[11px] text-ink-faint">(Minimum charge floor of ₦500 applies)</div>
                </div>
                <div className="font-display text-lg font-semibold text-moss-700">{formatNaira(computedShippingFee)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Marketplace preview modal */}
        {showPreviewModal && aiGeneratedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 animate-fade-in" onClick={() => setShowPreviewModal(false)}>
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-line bg-paper p-6 shadow-pop animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-display text-base font-semibold text-moss-700">Marketplace listing preview</h3>
                <button type="button" onClick={() => setShowPreviewModal(false)} className="rounded-full p-1.5 text-ink-faint hover:bg-paper-mist cursor-pointer"><X size={18} /></button>
              </div>

              {aiGeneratedData.image ? (
                <img src={aiGeneratedData.image} alt={aiGeneratedData.title} className="mb-4 h-52 w-full rounded-lg object-cover" />
              ) : (
                <div className="mb-4 flex h-52 w-full items-center justify-center rounded-lg bg-paper-sunk text-xs text-ink-faint">No photo uploaded</div>
              )}

              <h3 className="mb-1 text-base font-medium text-ink">{aiGeneratedData.title}</h3>
              <p className="mb-2.5 text-xs text-ink-faint">Store: <b className="text-ink-soft">{aiGeneratedData.vendorName}</b> · Pickup: <b className="text-ink-soft">{aiGeneratedData.pickupAddress}</b></p>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="font-display text-xl font-semibold text-moss-700">{formatNaira(aiGeneratedData.salePrice)}</span>
                {aiGeneratedData.originalPrice > aiGeneratedData.salePrice && (
                  <span className="text-sm text-ink-faint line-through">{formatNaira(aiGeneratedData.originalPrice)}</span>
                )}
                <span className="badge-gold">{aiGeneratedData.condition === 'fairly_used' ? 'Fairly used' : 'Brand new'}</span>
              </div>

              <p className="text-sm leading-relaxed text-ink-soft">{aiGeneratedData.description}</p>

              <div className="my-3 space-y-1 rounded-lg bg-paper-mist p-3 text-xs text-ink-soft">
                <p>Accepts swapping: <b className="text-ink">{aiGeneratedData.acceptsSwap ? 'Yes' : 'No'}</b></p>
                <p>Shipping weight: <b className="text-ink">{aiGeneratedData.weightKg} kg</b></p>
              </div>

              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => setShowPreviewModal(false)} className="btn-secondary flex-1">Edit product</button>
                <button type="button" onClick={handlePublish} className="btn-primary flex-1">
                  <CheckCircle2 size={16} /> Publish now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vendor chat modal */}
        {activeChatProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 animate-fade-in" onClick={() => setActiveChatProduct(null)}>
            <div className="flex h-[500px] w-full max-w-md flex-col rounded-xl border border-line bg-paper p-5 shadow-pop animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-sm font-medium text-ink">Chat with {vendor.shopName}</h3>
                <button type="button" onClick={() => setActiveChatProduct(null)} className="rounded-full p-1.5 text-ink-faint hover:bg-paper-mist cursor-pointer"><X size={18} /></button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto py-2">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                      msg.sender === 'customer' ? 'ml-auto bg-moss text-white' : msg.sender === 'system' ? 'mx-auto bg-paper-mist text-ink-faint' : 'bg-paper-sunk text-ink'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 border-t border-line pt-3">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type your message…" className="input text-xs" />
                <button type="button" onClick={sendChatMessage} className="btn-primary btn-sm shrink-0">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
