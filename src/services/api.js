// src/services/api.js
//
// The one file in this project that knows how to talk to the BravoMart
// backend. Every page that needs real data imports functions from here
// instead of calling `fetch` directly — so if the backend's base URL, auth
// header format, or error shape ever changes, this is the only file that
// needs to change.
//
// Backend reference (see bravomart-backend/README.md):
//   POST /api/auth/login                -> { user, accessToken }  (+ refresh cookie)
//   POST /api/auth/refresh              -> { accessToken }        (reads refresh cookie)
//   POST /api/auth/logout               -> { loggedOut: true }
//   GET  /api/auth/me                   -> current user (needs Authorization header)
//   POST /api/admin/products/ai-create  -> the AI listing generator (needs Authorization header)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// The AI endpoint returns image URLs relative to the BACKEND ("/uploads/products/…"),
// not the frontend — so an <img src> needs the backend's origin prepended.
// API_BASE_URL is "http://localhost:4000/api"; strip the trailing "/api" to get
// the plain origin the uploaded files are served from.
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function resolveMediaUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  return `${API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * A small typed error so callers can show the backend's real message
 * (e.g. "Invalid credentials or shop verification is still pending by
 * BravoMart Admin.") instead of a generic "Something went wrong."
 */
export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Core request helper. Two things every single call to this backend needs,
 * handled once here instead of being repeated in every page:
 *
 *  - `credentials: 'include'` — without this, the browser will not send (or
 *    store) the httpOnly refresh-token cookie the backend sets on login,
 *    because the API and the Vite dev server run on different ports, which
 *    counts as a different origin.
 *  - Automatic silent refresh-and-retry on a 401 — an access token is only
 *    valid for 15 minutes; rather than every page having to know that and
 *    handle it, one failed request here quietly tries POST /auth/refresh
 *    once and retries the original request with the new token.
 */
async function request(path, { method = 'GET', body, accessToken, isFormData = false, _retried = false } = {}) {
  const headers = {};
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (body && !isFormData) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // A non-JSON response (e.g. the server is down entirely) — payload stays null.
  }

  if (response.status === 401 && accessToken && !_retried && path !== '/auth/refresh') {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request(path, { method, body, accessToken: refreshed, isFormData, _retried: true });
    }
  }

  if (!response.ok) {
    const message = payload?.message || 'Something went wrong. Please try again.';
    throw new ApiError(message, response.status, payload?.details);
  }

  return payload;
}

async function tryRefresh() {
  try {
    const result = await request('/auth/refresh', { method: 'POST' });
    return result?.data?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function loginVendor(identifier, password) {
  const result = await request('/auth/login', { method: 'POST', body: { identifier, password } });
  return result.data; // { user, accessToken }
}

/**
 * Calls POST /api/auth/vendor/register. Backend expects multipart/form-data
 * (the ID card upload goes through Multer) with the same field names
 * VendorRegister.jsx's form already collects: fullName, homeAddress,
 * shopName, shopAddress, businessType, phone, email, username, password,
 * idCard (file).
 */
export async function registerVendor({ idCardFile, ...fields }) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value);
  });
  if (idCardFile) formData.append('idCard', idCardFile);

  const result = await request('/auth/vendor/register', { method: 'POST', body: formData, isFormData: true });
  return result.data;
}

export async function fetchCurrentUser(accessToken) {
  const result = await request('/auth/me', { accessToken });
  return result.data;
}

export async function refreshSession() {
  const result = await request('/auth/refresh', { method: 'POST' });
  return result.data; // { accessToken }
}

export async function logoutSession(accessToken) {
  await request('/auth/logout', { method: 'POST', accessToken });
}

/**
 * Calls the AI product listing generator: POST /api/admin/products/ai-create.
 *
 * `imageFile`, if provided, must be a real File object (not a preview URL) —
 * it's sent as multipart/form-data alongside the text prompt, exactly like
 * the backend's Multer middleware expects.
 */
export async function generateAiProductListing({ prompt, imageFile, weightKg, accessToken }) {
  const formData = new FormData();
  formData.append('prompt', prompt);
  if (imageFile) formData.append('image', imageFile);
  if (weightKg) formData.append('weightKg', weightKg);

  const result = await request('/admin/products/ai-create', {
    method: 'POST',
    body: formData,
    isFormData: true,
    accessToken,
  });
  return result.data; // the saved product: { id, title, description, price, category, tags, inventory, imageUrl, vendor, ... }
}
