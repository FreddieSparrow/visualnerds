# VisualNerds — AI Film Studio

Official website for **VisualNerds**, an AI-native film studio based near London, UK. Live at [visualnerds.com](https://visualnerds.com) and [visualnerds.co.uk](https://visualnerds.co.uk).

## Stack

Pure static site — HTML5 / CSS3 / Vanilla JS. No build tools, no frameworks, no dependencies beyond Google Fonts.

## Structure

```
/                    ← all files served from root
├── index.html       ← homepage
├── about.html
├── portfolio.html
├── services.html
├── contact.html
├── faq.html
├── press.html
├── our-technology.html
├── official-sites.html
├── terms.html       ← Terms & Conditions
├── privacy.html     ← Privacy Policy
├── coming-soon.html ← placeholder for upcoming services
├── styles.css       ← all styles
├── app.js           ← all JS (nav, canvas, typewriter, counters, etc.)
├── CNAME            ← GitHub Pages custom domain
└── ai-*.html        ← SEO redirect pages (→ index.html or services.html)
```

## GitHub Pages Deployment

This site is deployed via GitHub Pages with a custom domain.

1. Push all files to the `main` branch (files live in the **repository root** — no subdirectory)
2. Go to **Settings → Pages** in the GitHub repo
3. Set source to `main` branch, root `/`
4. GitHub Pages will read the `CNAME` file and serve from `visualnerds.com`
5. Configure DNS at your domain registrar:
   - `A` records pointing to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record: `www` → `freddieSparrow.github.io` (replace with your GitHub username)
   - Enforce HTTPS in GitHub Pages Settings

## Multi-domain setup (visualnerds.co.uk → visualnerds.com)

GitHub Pages only supports **one** custom apex domain per repository (set in the `CNAME` file — currently `visualnerds.com`). The `.co.uk` domain cannot be a second GitHub Pages domain on the same repo. Instead, configure forwarding at the **domain registrar**:

### Option A — Registrar URL forwarding (simplest)
In your `.co.uk` registrar control panel, add a **301 permanent redirect** (URL forwarding) from `visualnerds.co.uk` to `https://visualnerds.com`. Most registrars (Namecheap, GoDaddy, 123-reg, etc.) offer this as "URL Redirect" or "Web Forwarding" in DNS settings. This requires no code changes.

### Option B — Cloudflare (recommended for HTTPS + naked domain)
1. Add both `visualnerds.com` and `visualnerds.co.uk` to a free Cloudflare account
2. On `visualnerds.co.uk`, add a **Page Rule** (or Redirect Rule): `visualnerds.co.uk/*` → `https://visualnerds.com/$1` (301)
3. This preserves HTTPS on the `.co.uk` domain before redirecting

## Notes

- Email addresses in certain CTAs are base64-obfuscated and decoded at runtime by `app.js` — this is intentional spam prevention
- SEO redirect pages (`ai-*.html`, `3d-printing.html`, etc.) use instant meta-refresh + JS redirect with canonical URLs pointing to the main domain
- Legal documents (terms.html, privacy.html) are governed by the laws of England and Wales
- All content was created in whole or in part with AI assistance — see Section 17 of terms.html
