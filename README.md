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

## GitHub Pages Deployment (via Cloudflare)

Both domains are managed through Cloudflare.

### Step 1 — GitHub Pages settings
1. Push all files to the `main` branch (files live in the **repository root**)
2. Go to **Settings → Pages** in the GitHub repo → set source to `main`, root `/`
3. The `CNAME` file already contains `visualnerds.com` — GitHub Pages will use it

### Step 2 — visualnerds.com DNS (Cloudflare)
In the `visualnerds.com` Cloudflare dashboard → **DNS**:
- Add 4 × **A records** for `@` (apex), each set to **DNS only (grey cloud)**:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Add a **CNAME** record: `www` → `USERNAME.github.io` — set to **DNS only (grey cloud)**
- ⚠️ Keep these **grey cloud (DNS only)** — if proxied, GitHub Pages HTTPS cert provisioning breaks

Then in GitHub Pages Settings → enable **Enforce HTTPS**.

### Step 3 — visualnerds.co.uk redirect (Cloudflare)
GitHub Pages only supports one custom apex domain per repo, so `.co.uk` must redirect.

In the `visualnerds.co.uk` Cloudflare dashboard:
1. **DNS** — add a placeholder A record: `@` → `192.0.2.1`, set to **Proxied (orange cloud)** (needed for the redirect to fire)
2. **Rules → Redirect Rules** → Create rule:
   - Name: `Redirect .co.uk to .com`
   - Field: `Hostname` / `equals` / `visualnerds.co.uk`
   - Action: **Dynamic redirect**
   - URL expression: `concat("https://visualnerds.com", http.request.uri.path)`
   - Status code: `301`
3. This forwards `visualnerds.co.uk/any/page` → `visualnerds.com/any/page` with full HTTPS

## Notes

- Email addresses in certain CTAs are base64-obfuscated and decoded at runtime by `app.js` — this is intentional spam prevention
- SEO redirect pages (`ai-*.html`, `3d-printing.html`, etc.) use instant meta-refresh + JS redirect with canonical URLs pointing to the main domain
- Legal documents (terms.html, privacy.html) are governed by the laws of England and Wales
- All content was created in whole or in part with AI assistance — see Section 17 of terms.html
