# Bharat.gov — India, simplified (concept demo)

A friendly, AI-powered, **multilingual** front door to India's government schemes and
services — a concept demo inspired by the [america.gov](https://america.gov) relaunch,
reimagined for India.

> ⚠️ **This is an independent concept demo. It is not affiliated with, endorsed by, or an
> official website of the Government of India.** All external links point to the genuine
> official portals (uidai.gov.in, pmkisan.gov.in, pmjay.gov.in, myscheme.gov.in, …).

**Live:** https://bharat-gov.surge.sh

## What's inside
- **Real GoI schemes & services** organised by life-event (Money, Health, Education, Jobs,
  Housing, Travel, Family, Farmers, Pension, Identity) — Aadhaar, DigiLocker, UPI, PM-KISAN,
  Ayushman Bharat, PM Awas, Ujjwala, Passport Seva, e-Shram, Mudra, and more.
- **11 Indian languages** (English, हिन्दी, বাংলা, தமிழ், తెలుగు, मराठी, ગુજરાતી, ಕನ್ನಡ,
  മലയാളം, ਪੰਜਾਬੀ, اردو — with full RTL support for Urdu) for diversity & inclusion.
- **Ask Bharat AI** — an in-browser assistant that answers questions about schemes,
  documents and eligibility in your chosen language, grounded in the real scheme list.
- **Indian tricolour design** — saffron / white / green palette, a spinning Ashoka Chakra
  motif, and a clean, modern, mobile-first layout.

## AI setup (bring your own key)
The assistant calls the **Claude (Anthropic) API directly from your browser**. For safety,
**no key is hardcoded or committed** — you paste your own key into the panel and it is
stored only in your browser's `localStorage`. Get a key at
[console.anthropic.com](https://console.anthropic.com), open **Ask Bharat AI**, paste it,
and start chatting. (Cursor keys aren't usable in-browser; use an Anthropic Claude key.)

## Tech
Plain static HTML/CSS/JS — no build step. `data.js` (schemes), `i18n.js` (translations),
`app.js` (rendering + AI streaming), `styles.css`, `index.html`. Hosted on surge.sh.

## Run locally
```bash
npx serve .   # or any static server, then open the printed URL
```
