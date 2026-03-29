/* ══════════════════════════════════════════════════════════════
   VISUAL NERDS — Adaptive Device & Performance Layer  v2
   Loads in <head> before first paint.

   Detects:  browser engine · device tier · hardware · network
   Sets:     CSS classes on <html>
   Exposes:  window.VN.device  (read anywhere in app.js)
   Fires:    CustomEvent 'vn:device-update' on change
   Adapts:   DOM + features in real time
══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var html = document.documentElement;
  var nav  = navigator;
  var ua   = nav.userAgent || '';
  var conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};

  // ══════════════════════════════════════════════════════════════
  // 1. BROWSER DETECTION
  // ══════════════════════════════════════════════════════════════
  var browser = {
    isChrome:  /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua),
    isFirefox: /Firefox\//.test(ua),
    isSafari:  /Safari\//.test(ua) && !/Chrome\//.test(ua),
    isEdge:    /Edg\//.test(ua),
    isOpera:   /OPR\//.test(ua),
    isSamsung: /SamsungBrowser\//.test(ua),

    // Engine
    isWebKit: /AppleWebKit\//.test(ua) && !/Chrome\//.test(ua),
    isBlink:  /Chrome\//.test(ua),
    isGecko:  /Gecko\//.test(ua) && !/like Gecko/.test(ua),

    // OS
    isIOS:     /iPad|iPhone|iPod/.test(ua) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1),
    isAndroid: /Android/.test(ua),
    isMacOS:   /Macintosh/.test(ua) && !(/iPad|iPhone/.test(ua)),
    isWindows: /Windows NT/.test(ua),
    isLinux:   /Linux/.test(ua) && !/Android/.test(ua),

    // Known limitations
    hasBackdropFilter: CSS.supports('backdrop-filter', 'blur(1px)'),
    hasContainerQuery: CSS.supports('container-type', 'inline-size'),
    hasWebGL: (function() {
      try {
        var c = document.createElement('canvas');
        return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
      } catch(e) { return false; }
    })(),
  };

  // ══════════════════════════════════════════════════════════════
  // 2. HARDWARE & NETWORK SNAPSHOT
  // ══════════════════════════════════════════════════════════════
  var vw = window.innerWidth;
  var vh = window.innerHeight;

  var device = {
    // Viewport
    vw: vw,
    vh: vh,

    // Form factor
    isMobile:  vw < 768,
    isTablet:  vw >= 768 && vw < 1024,
    isDesktop: vw >= 1024,

    // Input
    isTouch: ('ontouchstart' in window) || (nav.maxTouchPoints > 0),

    // Display
    dpr:       window.devicePixelRatio || 1,
    isHighDPI: (window.devicePixelRatio || 1) > 1.5,
    isRetina:  (window.devicePixelRatio || 1) >= 2,

    // Motion / colour preferences
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersDark:          window.matchMedia('(prefers-color-scheme: dark)').matches,

    // Network (Network Information API where available)
    saveData:         conn.saveData === true,
    connectionType:   conn.effectiveType || 'unknown',
    downlink:         conn.downlink || Infinity,        // Mbps
    rtt:              conn.rtt     || 0,                // ms
    isSlowConnection: conn.effectiveType === '2g'      ||
                      conn.effectiveType === 'slow-2g' ||
                      conn.saveData      === true      ||
                      (conn.downlink !== undefined && conn.downlink < 1.5),

    // Hardware
    cpuCores: nav.hardwareConcurrency || 4,
    memory:   nav.deviceMemory        || 4,   // GB (rounded)

    // Orientation
    orientation: vw > vh ? 'landscape' : 'portrait',

    // Browser info (attached below)
    browser: browser,

    // Performance tier (set in computeTier)
    tier: 'high',       // 'high' | 'mid' | 'low'
    isLowEnd:  false,
    isMidEnd:  false,
    isHighEnd: false,
    isCapable: false,

    // Feature flags (what this device should render)
    features: {},
  };

  // ══════════════════════════════════════════════════════════════
  // 3. PERFORMANCE TIER + FEATURE FLAGS
  // ══════════════════════════════════════════════════════════════
  function computeTier() {
    var score = 0;

    // Hardware points
    if (device.cpuCores >= 8)  score += 3;
    else if (device.cpuCores >= 4) score += 2;
    else score += 1;

    if (device.memory >= 8)  score += 3;
    else if (device.memory >= 4) score += 2;
    else score += 1;

    if (device.isDesktop) score += 2;
    else if (device.isTablet) score += 1;

    if (!device.isHighDPI) score += 1; // less pixels to push = more headroom

    // Network points
    if (!device.isSlowConnection) score += 1;
    if (device.downlink >= 10) score += 1;

    // Browser engine: Blink generally has the best renderer performance
    if (browser.isBlink) score += 1;

    // Penalise
    if (device.prefersReducedMotion) score -= 5;
    if (device.isSlowConnection)     score -= 2;
    if (device.saveData)             score -= 3;
    if (browser.isIOS && device.isMobile) score -= 1; // iOS throttling

    // Assign tier
    if (score >= 9) {
      device.tier    = 'high';
      device.isHighEnd = true;
    } else if (score >= 5) {
      device.tier    = 'mid';
      device.isMidEnd = true;
    } else {
      device.tier    = 'low';
      device.isLowEnd = true;
    }
    device.isCapable = !device.isLowEnd;

    // ── Feature flags ────────────────────────────────────────────
    // Each flag tells app.js whether to enable that feature.
    device.features = {
      // Animations & visuals
      neuralCanvas:       device.isHighEnd && browser.hasWebGL,
      heroParallax:       device.isHighEnd && device.isDesktop,
      cursorGlow:         device.isHighEnd && !device.isTouch && device.isDesktop,
      backdropBlur:       browser.hasBackdropFilter,
      smoothTransitions:  !device.isLowEnd,
      particleEffects:    device.isHighEnd,

      // Images
      loadHeroImage:      !device.isSlowConnection && !device.saveData,
      lazyImages:         true,

      // Behaviour
      scrollReveal:       !device.isLowEnd,
      counterAnimations:  !device.isLowEnd,
      typewriter:         !device.isLowEnd,
      magneticButtons:    device.isDesktop && !device.isLowEnd,
      pageTransitions:    !device.isLowEnd,

      // Accessibility
      focusTrap:          true,
      scrollProgress:     !device.isMobile || !device.isLowEnd,
    };
  }

  computeTier();

  // ══════════════════════════════════════════════════════════════
  // 4. CSS CLASSES ON <html>
  // ══════════════════════════════════════════════════════════════
  var ALL_DEVICE_CLASSES = [
    'is-mobile','is-tablet','is-desktop',
    'is-touch','is-mouse',
    'is-hidpi','is-retina',
    'tier-high','tier-mid','tier-low',
    'is-low-end','is-capable',
    'allow-motion','no-motion',
    'slow-connection','save-data',
    'orient-landscape','orient-portrait',
    'browser-safari','browser-firefox','browser-chrome','browser-edge',
    'os-ios','os-android','os-macos','os-windows',
    'no-backdrop-filter','no-webgl',
  ];

  function applyClasses() {
    html.classList.remove.apply(html.classList, ALL_DEVICE_CLASSES);

    var add = [
      device.isMobile  ? 'is-mobile'  : '',
      device.isTablet  ? 'is-tablet'  : '',
      device.isDesktop ? 'is-desktop' : '',
      device.isTouch   ? 'is-touch'   : 'is-mouse',
      device.isHighDPI ? 'is-hidpi'   : '',
      device.isRetina  ? 'is-retina'  : '',
      'tier-' + device.tier,
      device.isLowEnd  ? 'is-low-end' : 'is-capable',
      device.prefersReducedMotion ? 'no-motion'      : 'allow-motion',
      device.isSlowConnection     ? 'slow-connection' : '',
      device.saveData             ? 'save-data'       : '',
      'orient-' + device.orientation,
      // Browser
      browser.isSafari  ? 'browser-safari'  : '',
      browser.isFirefox ? 'browser-firefox' : '',
      browser.isChrome  ? 'browser-chrome'  : '',
      browser.isEdge    ? 'browser-edge'    : '',
      // OS
      browser.isIOS     ? 'os-ios'          : '',
      browser.isAndroid ? 'os-android'      : '',
      browser.isMacOS   ? 'os-macos'        : '',
      browser.isWindows ? 'os-windows'      : '',
      // Feature support
      !browser.hasBackdropFilter ? 'no-backdrop-filter' : '',
      !browser.hasWebGL          ? 'no-webgl'           : '',
    ].filter(Boolean);

    html.classList.add.apply(html.classList, add);
  }

  applyClasses();

  // ══════════════════════════════════════════════════════════════
  // 5. ADAPTIVE DOM — runs after DOMContentLoaded
  // ══════════════════════════════════════════════════════════════
  function adaptDOM() {
    var f = device.features;

    // — Hero image: skip on slow connection
    var heroImg = document.querySelector('.vn-hero__img');
    if (heroImg && !f.loadHeroImage) {
      heroImg.style.display = 'none';
    }

    // — Nav logo size
    var navLogoImg = document.querySelector('.nav-logo__img');
    if (navLogoImg) {
      navLogoImg.style.height = device.isMobile ? '32px' : '44px';
    }

    // — Hero title font scale
    var heroSpans = document.querySelectorAll('.vn-hero__brand-center span');
    if (heroSpans.length) {
      var size = device.isMobile  ? 'clamp(3rem,15vw,5rem)' :
                 device.isTablet  ? 'clamp(4rem,12vw,7rem)' :
                                    'clamp(4rem,10vw,9rem)';
      heroSpans.forEach(function(s) { s.style.fontSize = size; });
    }

    // — Quick contact strip: stack on mobile
    var qc = document.querySelector('.vn-quick-contact');
    if (qc && device.isMobile) {
      qc.style.cssText += 'flex-direction:column;gap:16px;text-align:center;';
    }

    // — Hero CTA: tighten on mobile
    var cta = document.querySelector('.vn-hero__cta');
    if (cta && device.isMobile) {
      cta.style.padding  = '14px 24px';
      cta.style.fontSize = '0.75rem';
    }

    // — Footer logo
    var footerImg = document.querySelector('.footer-logo__img');
    if (footerImg) {
      footerImg.style.height = device.isMobile ? '44px' : '64px';
    }

    // — Backdrop filter fallback for browsers that don't support it
    if (!browser.hasBackdropFilter) {
      document.querySelectorAll('.vn-hero__cta, .mobile-menu').forEach(function(el) {
        el.style.backdropFilter = 'none';
        el.style.background     = 'rgba(10,10,11,0.85)';
      });
    }

    // — Slow connection banner (dismissible)
    if (device.isSlowConnection && !sessionStorage.getItem('vn_slow_dismissed')) {
      var banner = document.createElement('div');
      banner.style.cssText = [
        'position:fixed','bottom:0','left:0','right:0',
        'background:#111113','border-top:1px solid rgba(255,45,136,0.25)',
        'padding:10px 20px','display:flex','align-items:center',
        'justify-content:space-between','gap:16px','z-index:8000',
        'font-family:"Space Mono",monospace','font-size:0.68rem',
        'color:rgba(255,255,255,0.45)',
      ].join(';');
      banner.innerHTML = '<span>Slow connection — some visuals simplified.</span>' +
        '<button style="background:none;border:none;color:rgba(255,45,136,0.8);' +
        'cursor:pointer;font-family:inherit;font-size:0.68rem;padding:0;" ' +
        'onclick="this.parentElement.remove();sessionStorage.setItem(\'vn_slow_dismissed\',\'1\')">DISMISS ✕</button>';
      document.body.appendChild(banner);
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 6. REAL-TIME RE-ADAPTATION
  // ══════════════════════════════════════════════════════════════

  // Resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var newVW = window.innerWidth;
      var newVH = window.innerHeight;

      device.vw          = newVW;
      device.vh          = newVH;
      device.isMobile    = newVW < 768;
      device.isTablet    = newVW >= 768 && newVW < 1024;
      device.isDesktop   = newVW >= 1024;
      device.orientation = newVW > newVH ? 'landscape' : 'portrait';

      computeTier();
      applyClasses();
      adaptDOM();

      window.dispatchEvent(new CustomEvent('vn:device-update', { detail: device }));
    }, 150);
  }, { passive: true });

  // Orientation
  window.addEventListener('orientationchange', function () {
    setTimeout(function () {
      device.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      html.classList.remove('orient-landscape', 'orient-portrait');
      html.classList.add('orient-' + device.orientation);
      window.dispatchEvent(new CustomEvent('vn:device-update', { detail: device }));
    }, 100);
  });

  // Network Information API — live connection changes
  if (conn && conn.addEventListener) {
    conn.addEventListener('change', function () {
      device.connectionType   = conn.effectiveType || 'unknown';
      device.downlink         = conn.downlink || Infinity;
      device.rtt              = conn.rtt || 0;
      device.saveData         = conn.saveData === true;
      device.isSlowConnection = conn.effectiveType === '2g'      ||
                                 conn.effectiveType === 'slow-2g' ||
                                 conn.saveData      === true      ||
                                 (conn.downlink !== undefined && conn.downlink < 1.5);
      computeTier();
      applyClasses();
      adaptDOM();
      window.dispatchEvent(new CustomEvent('vn:device-update', { detail: device }));
    });
  }

  // ══════════════════════════════════════════════════════════════
  // 7. EXPOSE + INIT
  // ══════════════════════════════════════════════════════════════
  window.VN          = window.VN || {};
  window.VN.device   = device;
  window.VN.browser  = browser;

  // ── Low-performance notification (index.html only, 5 seconds) ──
  function maybeShowPerfNotice() {
    // Only on the homepage
    var path = window.location.pathname;
    var isHome = path === '/' || path === '/index.html' || path.endsWith('/index.html') || path === '';
    if (!isHome) return;

    // Only if not high-end and not already shown this session
    if (device.isHighEnd) return;
    if (sessionStorage.getItem('vn_perf_notice_shown')) return;

    sessionStorage.setItem('vn_perf_notice_shown', '1');

    var msg = device.isLowEnd
      ? 'Your device isn\'t powerful enough to run all visual features. Some effects have been disabled.'
      : 'Some high-end visual effects have been reduced for your device.';

    var notice = document.createElement('div');
    notice.id = 'vn-perf-notice';
    notice.style.cssText = [
      'position:fixed','top:80px','left:50%',
      'transform:translateX(-50%)',
      'background:#111113',
      'border:1px solid rgba(255,45,136,0.35)',
      'padding:14px 28px',
      'font-family:"Space Mono",monospace',
      'font-size:0.72rem',
      'color:rgba(255,255,255,0.7)',
      'letter-spacing:0.04em',
      'z-index:9990',
      'max-width:420px','width:90%',
      'text-align:center',
      'line-height:1.6',
      'opacity:0',
      'transition:opacity 0.3s ease',
      'pointer-events:none',
    ].join(';');
    notice.textContent = msg;
    document.body.appendChild(notice);

    // Fade in
    requestAnimationFrame(function() {
      notice.style.opacity = '1';
    });

    // Fade out and remove after 5 seconds
    setTimeout(function() {
      notice.style.opacity = '0';
      setTimeout(function() { notice.remove(); }, 300);
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      adaptDOM();
      maybeShowPerfNotice();
    });
  } else {
    adaptDOM();
    maybeShowPerfNotice();
  }

})();
