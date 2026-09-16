# BravoMart Design System

BravoMart is a Nigerian everything-marketplace: 50kg bags of garri from a
Bodija market stall sit in the same grid as excavators and real estate, and
every listing carries an AI-generated trust/scam report. The design system
below is built around two ideas that come directly from that: **trust has to
be legible at a glance across wildly different product types**, and **the
UI needs to stay quiet enough that a bag of garri and a bulldozer both look
credible in it.**

## Color

| Token | Hex | Use |
|---|---|---|
| `ink` | `#14181B` | Primary text |
| `ink-soft` | `#4B5259` | Secondary text |
| `ink-faint` | `#7A828A` | Placeholder / disabled text |
| `paper` | `#FFFFFF` | Page background |
| `paper-mist` | `#F6F7F4` | Section background, hover fill |
| `paper-sunk` | `#EFF1EC` | Input/skeleton background |
| `line` | `#E3E5DF` | Default hairline border |
| `line-strong` | `#CBCFC6` | Emphasized border, input border |
| `moss` (`DEFAULT #1F5A38`, 50–900) | green | Brand / trust / verified / primary actions |
| `gold` (`DEFAULT #B8791A`, 50–700) | amber-brown | Money, prices, flash drops — used sparingly |
| `clay` (`DEFAULT #A93226`, 50/100/600) | red | Scam warnings, destructive actions, errors |

Rules: no gradients anywhere. Cards are separated with a 1px `line` border,
never a shadow — shadows (`shadow-float`, `shadow-pop`) are reserved for
things that float above the page (dropdowns, modals, toasts).

## Type

- **Display** — Space Grotesk (headings, prices, the wordmark). Used because
  its squared numerals read well for currency, and it has enough personality
  to avoid the generic-SaaS-sans look without being a display serif.
- **Body / UI** — Inter, for everything else.
- Scale: `text-xs` (labels/meta) → `text-sm` (body/UI) → `text-base` (lead
  paragraphs) → `text-2xl`/`text-3xl` (`.section-heading`, display font) →
  `text-4xl`+ (hero only).

## Components

Shared primitives live in `src/index.css` under `@layer components` so pages
never re-declare the same utility strings:

- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`
  (+ `.btn-sm` / `.btn-lg` size modifiers)
- Inputs: `.field-label`, `.input`, `.input-error`
- Surfaces: `.card`, `.card-interactive`
- Status: `.badge-moss` (verified/safe), `.badge-gold` (price/flash),
  `.badge-clay` (warning/scam-risk), `.badge-neutral`
- Layout: `.container-page`, `.section-heading`
- Loading: `.skeleton`

Reusable UI building blocks (trust seal, price display, category icon,
empty/error states) live in `src/components/ui/`. Feature components should
compose these rather than reimplementing markup for the same concept.

## Motion

Hover/active transitions are short (120–180ms) and only on things the user
is directly interacting with (buttons, cards, inputs). Page-level entrances
use a single `animate-rise-in` on the primary content block, not cascading
per-card fade-ins. `prefers-reduced-motion` disables all of it.

## Spacing & radius

- Radius: `rounded-sm` (6px, chips/badges) · default (10px, buttons/inputs)
  · `rounded-lg` (14px, cards) · `rounded-xl` (20px, modals/hero panels).
- Page content is capped at `max-w-content` (1280px) via `.container-page`.
