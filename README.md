# Visual Nerds — AI & VFX

Official website for **Visual Nerds**, an AI film and VFX studio. Live at [visualnerds.com](https://visualnerds.com) and [visualnerds.co.uk](https://visualnerds.co.uk).

**Made by nerds. Watched by everyone.**

---

## Brand

- **Primary colour:** Hot Pink `#FF2D88`
- **Secondary:** Electric Blue `#00C2FF` · Acid Yellow `#FFE600`
- **Background:** Ink `#0A0A0B`
- **Headlines:** Syne ExtraBold 800
- **Labels / UI:** Space Mono
- **Body:** DM Sans

---

## Stack

Pure static site — HTML5 / CSS3 / Vanilla JS. No build tools, no frameworks, no dependencies beyond Google Fonts.

---

## Site Structure

```
/
├── index.html          ← Single-page homepage (Hero · Reel · Work · Contact)
├── about.html          ← About page
├── portfolio.html      ← Full work / project list
├── services.html       ← Services overview
├── contact.html        ← Contact form
├── faq.html            ← FAQ
├── press.html          ← Press coverage
├── our-technology.html ← Technology stack info
├── official-sites.html ← Official domains info
├── privacy.html        ← Privacy Policy
├── terms.html          ← Terms & Conditions
├── styles.css          ← All styles (brand design system)
├── app.js              ← All JS (nav, mobile menu, video modal, contact form)
├── CNAME               ← GitHub Pages custom domain (visualnerds.com)
└── ai-*.html           ← SEO redirect pages → main domain
```

### Homepage sections (index.html)

| Anchor    | Content                                      |
|-----------|----------------------------------------------|
| `#home`   | Hero — full-bleed image, VISUAL NERDS / AI & VFX branding |
| `#reel`   | Vimeo showreel embed (add `data-vimeo="ID"`) |
| `#work`   | Project list table — DATE · VIDEO NAME · CLIENT · PLAY |
| `#contact`| Enquiry form + email                         |

---

## Adding Content

### Hero image
Replace the placeholder `<div class="vn-hero__bg">` in `index.html` with:
```html
<img src="hero.jpg" class="vn-hero__img" alt="Visual Nerds">
```
Or set `style="background-image:url('hero.jpg')"` on `.vn-hero__bg`.

### Reel video
Add `data-vimeo="YOUR_VIMEO_ID"` to the `#reelPlay` element, or replace the placeholder with a full Vimeo `<iframe>` embed inside `.vn-reel__frame`.

### Work table rows
In `index.html` (and `portfolio.html`), fill in each `.vn-work__row` and add `data-vimeo="VIMEO_ID"` to the PLAY button:
```html
<div class="vn-work__row">
  <span class="vn-work__date">2025</span>
  <span class="vn-work__name">Your Video Title</span>
  <span class="vn-work__client">Client Name</span>
  <button class="vn-work__play" data-vimeo="123456789">▶ PLAY</button>
</div>
```

### Social links
Replace `href="#"` on the `.vn-social` icon links in the footer of each page.

---

## Deployment (GitHub Pages + Cloudflare)

### Step 1 — GitHub Pages
1. Push all files to `main` branch (files live in **repository root**)
2. **Settings → Pages** → source: `main`, root `/`
3. `CNAME` file already contains `visualnerds.com`

### Step 2 — visualnerds.com DNS (Cloudflare)
In the `visualnerds.com` Cloudflare dashboard → **DNS** (all set to **DNS only / grey cloud**):
- 4 × A records for `@`: `185.199.108.153` · `.109.` · `.110.` · `.111.153`
- CNAME: `www` → `USERNAME.github.io`

Enable **Enforce HTTPS** in GitHub Pages Settings.

### Step 3 — visualnerds.co.uk redirect (Cloudflare)
In the `visualnerds.co.uk` dashboard:
1. DNS — placeholder A record `@` → `192.0.2.1` (**Proxied**)
2. Rules → Redirect Rules:
   - Match: `Hostname equals visualnerds.co.uk`
   - Action: Dynamic redirect
   - URL: `concat("https://visualnerds.com", http.request.uri.path)`
   - Status: `301`

---

## Notes

- Email is base64-obfuscated in `app.js` and decoded at runtime (spam prevention)
- SEO redirect pages use meta-refresh + JS redirect with canonical URLs
- Legal documents (terms.html, privacy.html) are governed by the laws of England and Wales
