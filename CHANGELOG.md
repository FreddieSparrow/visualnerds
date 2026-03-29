# Changelog — Visual Nerds Website

All notable changes to visualnerds.com are documented here.

---

## [Unreleased] — 29 March 2026

### Added
- **Hero image slideshow** — 5 background images rotate every 6 seconds with CSS fade transitions
- **"VISUAL / NERDS / STUDIO" hero layout** — three-line centred typographic hero: VISUAL + NERDS in hot pink (#FF2D8B, ExtraBold, ~50% frame width), STUDIO in electric blue (#00C2FF, regular weight, 0.3em tracking)
- **Reel section background** — replaced plain dark background with a semi-transparent cinematic image (bg-6.png) behind the reel player
- **"What We Do" section** — full-bleed split layout between image and copy, positioned between the reel and contact sections. Director-led copy with three stat callouts (Our Approach / The Pipeline / Who We Work With)
- **`.gitignore`** — created with `.DS_Store`, `Thumbs.db`, `*.log`, `node_modules/`, `.env`
- **LVM Films Ltd company registration** — all legal pages now identify Visual Nerds as a trading name of LVM Films Limited (Company No. 12476789)
- **Terms & Conditions** — completely rewritten as legally accurate document covering: definitions, services, AI-generated content, IP, payment terms, cancellation, liability, confidentiality, data protection, force majeure, governing law (England & Wales)
- **Privacy Policy** — updated "Who We Are" section with LVM Films Ltd company details and company number
- **Press kit** — updated with all 11 new bg images (bg-1 through bg-11), both logo versions (logo-2 + logo-3), correct brand colours (Hot Pink #FF2D8B, Electric Blue #00C2FF), updated boilerplate copy referencing LVM Films Ltd
- **Bootstrap nav** on privacy.html and press.html — replaced legacy hamburger nav with Bootstrap 5 navbar matching the homepage

### Changed
- **Image filenames** — all images renamed to simple names:
  - `Logo 1_remove white.png` → `logo.png`
  - `Logo2 _remove background.png` → `logo-2.png`
  - `Logo option 3_remove background.png` → `logo-3.png`
  - `Image background opion_1–11.png` → `bg-1.png` through `bg-11.png`
- **Nav and footer logos** — switched from `logo.png` to `logo-2.png` (transparent background version) on index.html, terms.html, privacy.html, press.html
- **Logo clip-path** — CSS `clip-path: inset(18% 0 18% 0)` applied to nav and footer logo images to remove white/grey bands baked into the PNG
- **Hero brand** — removed white colour from VISUAL/NERDS text, now hot pink (#FF2D8B). Added STUDIO line below in electric blue
- **Footer copyright line** — updated to "Visual Nerds — A trading name of LVM Films Ltd (12476789)"
- **Contact headline** — reduced font size (`clamp(2rem, 3.5vw, 3.25rem)`) and added `overflow-wrap: break-word` to prevent overflow into form column
- **Bootstrap form inputs** — added `.vn-input` CSS overrides with `!important` to beat Bootstrap's `.form-control` white background. Dark translucent brand styling applied
- **index.html section numbering** — contact section now shows "02 CONTACT" (reel is "01 REEL")
- **Footer copyright** — added LVM Films Ltd trading name and company number across index, terms, privacy, press pages

### Fixed
- **White form inputs** — Bootstrap's `.form-control` white background overridden with dark brand styling
- **"SOMETHING." headline overflow** — added `overflow-hidden` to Bootstrap column and reduced `clamp` font size
- **Logo white bands in footer and nav** — CSS clip-path removes baked-in PNG bands without editing the image file
- **Duplicate mailto** — removed previously concatenated double `mailto:` URI in contact form submission handler

### Files Modified
- `index.html` — hero, reel background, What We Do section, updated logo refs, footer
- `styles.css` — hero slideshow, hero brand colours, reel section, What We Do section, .vn-input Bootstrap override, logo clip-path, mobile responsive rules
- `terms.html` — full rewrite with LVM Films Ltd details, Bootstrap nav
- `privacy.html` — updated Who We Are, Bootstrap nav, logo, footer
- `press.html` — Bootstrap nav, all image filenames updated, logo updated, brand colours corrected, boilerplate updated, footer updated
- `.gitignore` — created
- `images/` — all files renamed to simple names

---

## Previous Sessions

### March 2026 (earlier)
- Site converted from custom nav/hamburger to Bootstrap 5.3.3
- All pages: Bootstrap CSS + JS CDN added, device.js removed
- app.js: scroll progress bar, cursor glow, page fade-in, toast system, form validation, textarea counter, lazy loading, runtime base64 decoder, honeypot, rate limiting, sanitisation
- Email changed from support@ to office@ sitewide
- Favicon updated to logo.png on all pages
- Quick contact strip added after reel section
- Press kit created with brand assets, editorial guidelines, embargo policy, social media policy
