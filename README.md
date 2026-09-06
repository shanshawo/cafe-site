# Mud & Smoke — Café Website

A warm, cozy single-page café site with a working order cart that sends orders to WhatsApp. Built as a demo site by Shanshawo (Harsh).

## Features

- Sticky nav + hero with "no rush" vibe
- Full menu (coffee, food, evenings) with ₹ INR prices
- **Cart system** — add items with the + button, adjust quantities, live total
- **WhatsApp ordering** — "Order on WhatsApp" opens a chat with the full order list + total preloaded, customer just hits send
- Call / email / Google Maps links
- Mobile responsive, warm cream + espresso + ember palette
- Fraunces serif + Inter sans (Google Fonts)

## Files

- `index.html` — structure & content
- `style.css` — all styling
- `script.js` — cart logic + WhatsApp order

## Customize

### Change the WhatsApp order number
Edit `script.js`, top of file:

```js
var WA_NUMBER = "919876543210"; // replace with the real number, country code first, no +
```

Also update the `wa.me` links in `index.html` (hero button + contact card) and the `tel:` link.

### Change email / address / hours
All in `index.html` → "Find us" section.

## Deploy on Netlify (free)

1. Push this folder to a GitHub repo
2. Netlify → "Add new site" → "Import an existing project" → pick the repo
3. Build command: leave empty · Publish directory: leave empty (it's a static site)
4. Deploy. Done.

Live demo preview (local): run `python3 -m http.server 8765` in this folder.

© 2026 Shanshawo — Built for demo. Site by Shanshawo.