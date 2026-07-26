/* ============================================================
   GAUTS STUDIO — script principal
   ------------------------------------------------------------
   1. Configuration des pages (système de pages) — éditer ici
      pour ajouter / réordonner des pages dans le header.
   2. Header partagé injecté (une seule source de vérité).
   3. Encoche de l'onglet actif : découpe peach dans le haut de
      la barre, qui glisse d'un onglet à l'autre.
   4. Menu déroulant (panneau qui défile de droite à gauche).
   5. Navigation interne SANS rechargement : le contenu de la
      page est remplacé à la volée pendant que l'encoche glisse.
      Repli conservé : redirection classique avec l'overlay navy
      qui balaie l'écran (voir « Repli » plus bas).
   6. Scripts de page (carrousel, frise) — rejoués après chaque
      changement de page.

   Le header est injecté dans tout élément <header data-site-header>.
   Pour créer une nouvelle page : copier le <head> et les blocs
   d'une page existante, puis ajouter une entrée dans PAGES.
   ============================================================ */

(() => {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. Configuration des pages
     ----------------------------------------------------------
     `short` = libellé dans la barre (l'espace y est compté),
     `label` = libellé complet dans le menu déroulant,
     `group` = côté du logo centré où l'onglet est placé.
     ---------------------------------------------------------- */
  const PAGES = [
    { href: 'services/sites-web.html',        label: 'Site web',         short: 'site web',   group: 'left' },
    { href: 'services/logo.html',             label: 'Logo & identité',  short: 'logo',       group: 'left' },
    { href: 'services/charte-graphique.html', label: 'Charte graphique', short: 'charte',     group: 'left' },
    { href: 'services/cartes-de-visite.html', label: 'Cartes de visite', short: 'cartes',     group: 'right' },
    { href: 'services/affiches.html',         label: 'Affiches',         short: 'affiches',   group: 'right' },
    { href: 'services/rebranding.html',       label: 'Rebranding',       short: 'rebranding', group: 'right' },
  ];

  const ANCHOR_LINKS = [
    { href: 'index.html#apropos', label: 'À propos' },
  ];
  const CTA = { href: 'index.html#contact', label: 'Contact' };

  /* ----------------------------------------------------------
     2. Header partagé — injection
     ---------------------------------------------------------- */
  const basename = (p) => p.split('/').pop() || 'index.html';

  // `base` = racine du site, déduite de l'URL de script.js (qui y est
  // posé). Plus fiable qu'un comptage de dossiers : fonctionne à la
  // racine, dans services/, et même si le site est servi dans un
  // sous-dossier (GitHub Pages de projet, préproduction…).
  const selfScript = document.currentScript || document.querySelector('script[src$="script.js"]');
  const base = selfScript ? new URL('.', selfScript.src).href : '';

  const fileOf = (pathname) => basename(pathname.replace(/\/+$/, '')) || 'index.html';
  let currentFile = fileOf(location.pathname);

  /* Favicon + theme-color : injectés pour bénéficier du même calcul
     de chemin que le header, sans toucher au HTML des pages.
     Le favicon est `favicon.ico` à la racine du site. */
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = `${base}favicon.ico`;
  document.head.appendChild(favicon);
  const themeColor = document.createElement('meta');
  themeColor.name = 'theme-color';
  themeColor.content = '#283977';
  document.head.appendChild(themeColor);

  const navItem = (page) => `<li><a class="nav-link"
      data-page="${basename(page.href)}"
      href="${base}${page.href}">${page.short || page.label}</a></li>`;

  const dropdownItem = (page) => `<a class="dropdown-link"
      data-page="${basename(page.href)}"
      href="${base}${page.href}">${page.label}</a>`;

  function buildHeader() {
    const left = PAGES.filter((p) => p.group === 'left').map(navItem).join('');
    const right = PAGES.filter((p) => p.group === 'right').map(navItem).join('');
    const dropdownLinks = PAGES.map(dropdownItem).join('');
    const dropdownAnchors = ANCHOR_LINKS
      .map((a) => `<a class="dropdown-link" href="${base}${a.href}">${a.label}</a>`)
      .join('');

    return `
      <div class="header-card" id="header-card">
        <svg class="nav-notch" id="nav-notch" aria-hidden="true" focusable="false">
          <path id="nav-notch-path" d=""></path>
        </svg>
        <nav class="container header-inner" id="main-nav" aria-label="Navigation principale">
          <ul class="nav-links nav-links-left">${left}</ul>
          <a href="${base}index.html" class="logo" aria-label="Gauts Studio — accueil">
            <img src="${base}assets/logo.svg" alt="Gauts Studio" class="logo-img">
          </a>
          <div class="header-right">
            <ul class="nav-links nav-links-right">${right}</ul>
            <button class="nav-toggle" id="nav-toggle" type="button"
              aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="dropdown">
              <span></span><span></span><span></span>
            </button>
          </div>
        </nav>
      </div>
      <div class="dropdown" id="dropdown" aria-hidden="true">
        <div class="dropdown-backdrop" id="dropdown-backdrop" tabindex="-1"></div>
        <div class="dropdown-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <button class="dropdown-close" id="dropdown-close" type="button" aria-label="Fermer le menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
          <nav class="dropdown-nav" aria-label="Menu complet">
            ${dropdownLinks}
            ${dropdownAnchors}
            <a class="dropdown-cta" href="${base}${CTA.href}">${CTA.label}</a>
          </nav>
        </div>
      </div>
    `;
  }

  document.querySelectorAll('[data-site-header]').forEach((host) => {
    host.classList.add('site-header');
    host.innerHTML = buildHeader();
  });

  /* Marque l'onglet courant, dans la barre comme dans le menu.
     Rejoué à chaque changement de page (navigation interne). */
  function markActive() {
    document.querySelectorAll('.nav-link, .dropdown-link').forEach((link) => {
      const on = link.dataset.page === currentFile;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  markActive();

  /* ----------------------------------------------------------
     3. Encoche de l'onglet actif
     ----------------------------------------------------------
     Une découpe peach dans le HAUT de la barre navy, tracée en
     un seul path SVG. De gauche à droite :
       raccord concave  → le peach s'évase vers le fond de page
       côté gauche      → penché vers l'intérieur (trapèze)
       coin bas arrondi
       base             → plus étroite que le sommet
       coin bas arrondi
       côté droit       → penché vers l'intérieur
       raccord concave
     Toutes les jonctions sont tangentes : aucun angle visible.
     ---------------------------------------------------------- */
  const NOTCH = {
    fillet: 22,     // rayon des raccords concaves, en haut
    slant: 7,       // resserrement de chaque côté vers le bas
    radius: 24,     // rayon des coins du bas
    pad: 7,         // débord horizontal autour de l'onglet
    depth: 0.83,    // profondeur, en fraction de la hauteur de la barre
    duration: 620,  // glissement d'un onglet à l'autre (ms)
  };

  const card = document.getElementById('header-card');
  const notchSvg = document.getElementById('nav-notch');
  const notchPathEl = document.getElementById('nav-notch-path');

  const round = (v) => Math.round(v * 100) / 100;

  function notchPath(x0, x1, h) {
    const r = Math.min(NOTCH.fillet, h / 2);
    const half = (x1 - x0) / 2;
    const s = Math.min(NOTCH.slant, Math.max(0, half - 6));
    const rb = Math.max(2, Math.min(NOTCH.radius, half - s - 2));
    const len = Math.hypot(s, h - r) || 1;
    const ux = s / len;             // direction du côté penché, vers le bas
    const uy = (h - r) / len;
    const k = 0.55 * r;             // poignées des raccords concaves
    const clx = x0 + s;             // coin bas gauche
    const crx = x1 - s;             // coin bas droit
    const p = (x, y) => `${round(x)},${round(y)}`;

    return [
      `M${p(x0 - r, 0)}`,
      `C${p(x0 - r + k, 0)} ${p(x0 - k * ux, r - k * uy)} ${p(x0, r)}`,
      `L${p(clx - rb * ux, h - rb * uy)}`,
      `Q${p(clx, h)} ${p(clx + rb, h)}`,
      `L${p(crx - rb, h)}`,
      `Q${p(crx, h)} ${p(crx + rb * ux, h - rb * uy)}`,
      `L${p(x1, r)}`,
      `C${p(x1 + k * ux, r - k * uy)} ${p(x1 + r - k, 0)} ${p(x1 + r, 0)}`,
      'Z',
    ].join(' ');
  }

  const activeBarLink = () => (card ? card.querySelector('.nav-link.is-active') : null);

  const boundsOf = (link) => {
    const a = link.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    return { x0: a.left - c.left - NOTCH.pad, x1: a.right - c.left + NOTCH.pad };
  };

  function drawNotch(x0, x1) {
    if (x1 - x0 < 24) { notchPathEl.setAttribute('d', ''); return; }
    const h = Math.round(card.getBoundingClientRect().height * NOTCH.depth);
    notchPathEl.setAttribute('d', notchPath(x0, x1, h));
  }

  let notchAnim = null;
  let notchAt = null;   // dernière position tracée
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function animateNotch(from, to) {
    if (notchAnim) cancelAnimationFrame(notchAnim);
    const start = performance.now();
    const step = (now) => {
      const e = easeOut(Math.min(1, (now - start) / NOTCH.duration));
      drawNotch(from.x0 + (to.x0 - from.x0) * e, from.x1 + (to.x1 - from.x1) * e);
      notchAnim = e < 1 ? requestAnimationFrame(step) : null;
    };
    notchAnim = requestAnimationFrame(step);
  }

  /* Place l'encoche sur l'onglet actif — en glissant si demandé. */
  function moveNotch({ animate = true } = {}) {
    if (!card || !notchSvg) return;
    const link = activeBarLink();
    if (!link) {                     // page hors de la barre : pas d'encoche
      if (notchAnim) { cancelAnimationFrame(notchAnim); notchAnim = null; }
      notchPathEl.setAttribute('d', '');
      card.classList.remove('has-notch');
      notchAt = null;
      return;
    }
    card.classList.add('has-notch');
    notchSvg.classList.add('is-ready');
    const to = boundsOf(link);
    if (animate && notchAt && !prefersReducedMotion) {
      animateNotch(notchAt, to);
    } else {
      if (notchAnim) { cancelAnimationFrame(notchAnim); notchAnim = null; }
      drawNotch(to.x0, to.x1);
    }
    notchAt = to;
  }

  if (card && notchSvg) {
    /* Arrivée après une vraie redirection (repli) : l'encoche part de
       l'onglet précédent, mémorisé au clic, et glisse vers le nouveau. */
    const fromFile = sessionStorage.getItem('nav-from');
    sessionStorage.removeItem('nav-from');
    const fromLink = fromFile && fromFile !== currentFile
      ? card.querySelector(`.nav-link[data-page="${fromFile}"]`)
      : null;
    if (fromLink && !prefersReducedMotion) {
      card.classList.add('has-notch');
      notchSvg.classList.add('is-ready');
      notchAt = boundsOf(fromLink);
      drawNotch(notchAt.x0, notchAt.x1);
      setTimeout(() => moveNotch(), 90);
    } else {
      moveNotch({ animate: false });
    }

    window.addEventListener('resize', () => moveNotch({ animate: false }));
    // Les polices chargent en `display: swap` : la largeur des onglets
    // peut changer après le premier tracé.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!notchAnim) moveNotch({ animate: false }); });
    }
  }

  /* ----------------------------------------------------------
     4. Menu déroulant (défile droite → gauche)
     ---------------------------------------------------------- */
  const dropdown = document.getElementById('dropdown');
  const dropdownToggle = document.getElementById('nav-toggle');
  const dropdownClose = document.getElementById('dropdown-close');
  const dropdownBackdrop = document.getElementById('dropdown-backdrop');

  let dropdownOpen = false;
  const setDropdown = (open) => {
    if (!dropdown || !dropdownToggle) return;
    dropdownOpen = open;
    dropdown.classList.toggle('is-open', open);
    dropdown.setAttribute('aria-hidden', String(!open));
    dropdownToggle.setAttribute('aria-expanded', String(open));
    dropdownToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && dropdownClose) dropdownClose.focus();
  };

  if (dropdownToggle) dropdownToggle.addEventListener('click', () => setDropdown(!dropdownOpen));
  if (dropdownClose) dropdownClose.addEventListener('click', () => setDropdown(false));
  if (dropdownBackdrop) dropdownBackdrop.addEventListener('click', () => setDropdown(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdownOpen) setDropdown(false);
  });

  /* ----------------------------------------------------------
     5. Navigation
     ----------------------------------------------------------
     Par défaut : navigation INTERNE, sans rechargement. On récupère
     la page cible en fetch, on remplace le contenu de <main> (et du
     footer), et on met l'URL à jour. Le corps de page sort vers la
     gauche / entre par la droite, dans le même sens que l'encoche.

     Repli — l'overlay navy : si le fetch échoue (hors ligne, fichier
     ouvert en file://, page sans <main>…), on retombe sur une vraie
     redirection précédée de l'overlay `#page-transition`, un voile
     navy qui balaie l'écran de droite à gauche, puis repart vers la
     gauche à l'arrivée sur la nouvelle page (classe `html.pt-active`
     posée avant le premier paint par le script inline du <head>).
     Ce mécanisme est conservé volontairement : c'est le comportement
     de secours, et le seul disponible sans JavaScript de navigation.
     ---------------------------------------------------------- */
  const overlay = document.getElementById('page-transition');
  const html = document.documentElement;
  const PT_DURATION = 500;   // durée du balayage de l'overlay (CSS)
  const SWAP_OUT = 300;      // sortie du contenu (CSS)

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const sameOrigin = (url) => {
    try { return new URL(url, location.href).origin === location.origin; }
    catch { return false; }
  };

  const isInternalLink = (a) => {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    if (!sameOrigin(a.href)) return false;
    const target = new URL(a.href, location.href);
    const here = new URL(location.href);
    target.hash = '';
    here.hash = '';
    if (target.href === here.href) return false;   // ancre de la même page
    return true;
  };

  /* --- Repli : redirection classique avec l'overlay navy --- */
  function navigateWithTransition(href) {
    sessionStorage.setItem('nav-from', currentFile);
    if (!overlay || prefersReducedMotion) { location.href = href; return; }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem('pt-enter', '1');
      location.href = href;
    };
    overlay.classList.add('is-covering');
    const fallback = setTimeout(finish, PT_DURATION + 120);
    overlay.addEventListener('transitionend', function handler(ev) {
      if (ev.propertyName !== 'transform') return;
      clearTimeout(fallback);
      overlay.removeEventListener('transitionend', handler);
      finish();
    });
  }

  /* --- Navigation interne --- */
  const canSwap = typeof window.fetch === 'function' && typeof history.pushState === 'function';
  const pageCache = new Map();
  let swapping = false;

  async function fetchPage(url) {
    if (pageCache.has(url)) return pageCache.get(url);
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
    const main = doc.querySelector('main');
    if (!main) throw new Error('page sans <main>');
    const footer = doc.querySelector('.site-footer');
    const description = doc.querySelector('meta[name="description"]');
    const page = {
      main: main.innerHTML,
      footer: footer ? footer.innerHTML : null,
      title: doc.title,
      description: description ? description.getAttribute('content') : null,
    };
    pageCache.set(url, page);
    return page;
  }

  const prefetch = (url) => { if (canSwap) fetchPage(url).catch(() => {}); };

  async function goTo(url, { push = true } = {}) {
    const main = document.querySelector('main');
    const target = new URL(url, location.href);
    if (!canSwap || !main || swapping) { navigateWithTransition(target.href); return; }
    swapping = true;

    // 1. l'encoche part immédiatement vers le nouvel onglet
    const previousFile = currentFile;
    currentFile = fileOf(target.pathname);
    markActive();
    moveNotch();

    // 2. le contenu actuel sort vers la gauche pendant le chargement
    main.classList.add('is-swapping-out');

    let page;
    try {
      page = await fetchPage(target.href);
    } catch (err) {
      // Repli : on remet l'état d'avant et on redirige pour de vrai.
      currentFile = previousFile;
      markActive();
      moveNotch({ animate: false });
      main.classList.remove('is-swapping-out');
      swapping = false;
      navigateWithTransition(target.href);
      return;
    }

    if (!prefersReducedMotion) await wait(SWAP_OUT);

    // 3. remplacement du contenu
    main.innerHTML = page.main;
    const footer = document.querySelector('.site-footer');
    if (footer && page.footer !== null) footer.innerHTML = page.footer;
    document.title = page.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && page.description !== null) meta.setAttribute('content', page.description);
    if (push) history.pushState({ page: currentFile }, '', target.href);

    // 4. le nouveau contenu entre par la droite
    main.classList.remove('is-swapping-out');
    main.classList.add('is-swapping-in');
    void main.offsetWidth;               // force le recalcul avant de relâcher
    main.classList.remove('is-swapping-in');

    const anchor = target.hash ? document.getElementById(target.hash.slice(1)) : null;
    if (anchor) anchor.scrollIntoView({ behavior: 'auto', block: 'start' });
    else window.scrollTo(0, 0);

    initPage();
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    swapping = false;
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.classList.contains('page-transition-skip')) return;
    if (!isInternalLink(a)) return;
    e.preventDefault();
    if (dropdownOpen) setDropdown(false);
    goTo(a.href);
  });

  // Précharge au survol : le changement de page paraît instantané.
  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a');
    if (a && isInternalLink(a) && !a.classList.contains('page-transition-skip')) prefetch(a.href);
  });

  window.addEventListener('popstate', () => {
    if (fileOf(location.pathname) !== currentFile) goTo(location.href, { push: false });
  });

  // Arrivée après une vraie redirection : l'overlay est déjà couvrant
  // (html.pt-active posé avant le premier paint), on le fait défiler
  // vers la gauche puis on nettoie.
  if (overlay && html.classList.contains('pt-active')) {
    sessionStorage.removeItem('pt-enter');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('is-leaving');
      const cleanup = () => {
        overlay.classList.remove('is-leaving');
        html.classList.remove('pt-active');
        overlay.removeEventListener('transitionend', cleanup);
      };
      overlay.addEventListener('transitionend', cleanup);
      setTimeout(cleanup, PT_DURATION + 200);
    }));
  }

  /* ----------------------------------------------------------
     6. Scripts de page
     ----------------------------------------------------------
     Rejoués à chaque changement de page : le contenu de <main>
     ayant été remplacé, les éléments ciblés sont neufs.
     ---------------------------------------------------------- */
  function initCarousel() {
    const track = document.getElementById('hero-track');
    const prev = document.getElementById('hero-prev');
    const next = document.getElementById('hero-next');
    const dotsContainer = document.getElementById('hero-dots');
    if (!track || !prev || !next || !dotsContainer) return;

    const slides = track.querySelectorAll('.hero-slide');
    const dots = dotsContainer.querySelectorAll('.hero-dot');
    const carousel = track.closest('.hero-carousel');
    let index = 0;

    const goToSlide = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, k) => {
        const on = k === index;
        dot.classList.toggle('is-active', on);
        dot.setAttribute('aria-current', String(on));
      });
    };

    prev.addEventListener('click', () => goToSlide(index - 1));
    next.addEventListener('click', () => goToSlide(index + 1));
    dots.forEach((dot, k) => dot.addEventListener('click', () => goToSlide(k)));

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToSlide(index - 1);
      if (e.key === 'ArrowRight') goToSlide(index + 1);
    });

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) goToSlide(delta < 0 ? index + 1 : index - 1);
    }, { passive: true });
  }

  function initTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      timeline.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timeline.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(timeline);
  }

  function initPage() {
    initCarousel();
    initTimeline();
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  initPage();
})();
