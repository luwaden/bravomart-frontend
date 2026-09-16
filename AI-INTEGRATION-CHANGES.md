# What changed — real AI integration

This is the same BravoMart frontend you uploaded, with one thing fixed:
the AI Admin Assistant no longer fakes its results. It now calls the real
backend (`bravomart-backend`) built earlier — Express → Gemini
(`gemini-2.5-flash`) → PostgreSQL — and a vendor now has to actually log in
(a real `POST /api/auth/login` call, JWT access token, httpOnly refresh
cookie) before they can use it, because the backend's AI endpoint requires
one.

**Scope, stated plainly:** only what the AI feature needed to become real
was touched. Marketplace browsing, checkout, dispatch, BravoAdmin,
BravoSuperAdmin, the customer AccountPage, mock data — all untouched, still
exactly as you uploaded them.

## Files changed

| File | What changed |
| ----- | ------------- |
| `src/services/api.js` | **New.** The only file that talks to the backend — login, silent session refresh, logout, and the AI generation call. |
| `src/App.jsx` | Added real login/logout handlers and an on-load silent-refresh check; fixed a pre-existing bug where `VendorLogin` expected an `onLogin` prop that was never actually passed. |
| `src/pages/VendorLogin.jsx` | Now calls the real login endpoint instead of an undefined mock function; shows the backend's real error message; redirects to the AI Assistant on success. |
| `src/pages/AdminAiAssistant.jsx` | The "Generate" button now calls the real AI endpoint instead of a `setTimeout`. Everything else on this page (GPS dispatch tracker, shipping calculator, in-app chat, catalog tab) is unchanged. |
| `.env.example`, `.gitignore` | New — the backend's URL is now configurable, and `.env` is gitignored. |

## Why login had to be wired up too

The backend's AI endpoint is protected: `POST /api/admin/products/ai-create`
requires a valid access token belonging to a `VENDOR` (or `ADMIN`/
`SUPER_ADMIN`) account (see `bravomart-backend/src/middlewares/authorize.ts`).
There was no way to make the "Generate" button real without also making
login real — a mock user has no token to send.

## The prompt mapping

The backend's AI endpoint takes one thing from the client: a natural-language
`prompt` string (plus an optional photo). This form has several separate
fields (product name, brief description, price, discount price, condition).
`handleAiAutoFill` in `AdminAiAssistant.jsx` now folds those into one
sentence before sending it — e.g.:

> "5KW Hybrid Inverter. Barely used, all cables included. Price: ₦250000
> (discounted to ₦220000). Condition: fairly used."

Fields the AI was never asked to generate — weight, condition, swap
acceptance, pickup location — stay exactly as they were: locally controlled
by the form, layered onto the AI's response afterward rather than sent to
it.

## Category mapping — a real constraint, not a bug

The original mock invented its own categories (`groceries`, `electronics`,
`fashion`) matching BravoMart's actual marketplace taxonomy. The real
backend's AI endpoint is locked to exactly five categories — `Clothing`,
`Electronics`, `Home`, `Beauty`, `Other` — because that's the enum the
Gemini `responseSchema` (and the seeded `Category` table) were built
against. The frontend now shows whatever category the AI actually returns
from that fixed set, rather than a locally-invented one. Widening that enum
is a backend change (`PRODUCT_CATEGORIES` in
`bravomart-backend/src/schemas/aiProduct.schema.ts` — see that project's
`docs/GUIDE.md`), not something the frontend can paper over.

## Running it

```bash
# Terminal 1 — the backend (see bravomart-backend/README.md for full setup)
cd bravomart-backend
npm install && npm run dev

# Terminal 2 — this frontend
cd bravomart-frontend
npm install
cp .env.example .env   # defaults already point at http://localhost:4000/api
npm run dev
```

Log in with the demo vendor the backend's seed script creates
(`bravomart-backend/prisma/seed.ts`): username `demo-vendor`, password
`VendorPass123!`. Go to **AI Admin Assistant → Add New Product**, fill in a
product name and description, optionally attach a photo, and click
**Generate Listing with AI** — that request now goes to Gemini for real.

## Verified before delivery

- `npx eslint` on every changed file — zero *new* errors introduced (the
  project's existing lint baseline has 8 pre-existing issues, all
  unrelated to this change and confirmed identical before/after by
  diffing against the original files).
- `npx vite build` — a full production build completes successfully.
