// Menu mobile
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Ferme le menu après clic sur un lien (mobile)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Encoche de la nav desktop — glisse sous le lien actif/survolé/focus
const navLinksEl = document.getElementById('nav-links');
const navNotch = document.getElementById('nav-notch');

if (navLinksEl && navNotch) {
  const navLinkEls = Array.from(navLinksEl.querySelectorAll('.nav-link'));
  const activeNavLink = navLinksEl.querySelector('.nav-link[aria-current="page"]') || navLinkEls[0];
  const prefersReducedMotionNav = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const moveNotch = (link, animate = true) => {
    if (!link) return;
    if (!animate || prefersReducedMotionNav) navNotch.style.transitionDuration = '0s';
    navNotch.style.width = `${link.offsetWidth}px`;
    navNotch.style.transform = `translateX(${link.offsetLeft}px)`;
    navLinkEls.forEach(l => l.classList.toggle('is-tab-active', l === link));
    if (!animate || prefersReducedMotionNav) {
      navNotch.getBoundingClientRect(); // force reflow avant de réactiver la transition
      navNotch.style.transitionDuration = '';
    }
  };

  const resetNotchToActive = () => moveNotch(activeNavLink);

  moveNotch(activeNavLink, false);

  navLinkEls.forEach(link => {
    link.addEventListener('mouseenter', () => moveNotch(link));
    link.addEventListener('focus', () => moveNotch(link));
  });

  navLinksEl.addEventListener('mouseleave', resetNotchToActive);
  navLinksEl.addEventListener('focusout', (e) => {
    if (!navLinksEl.contains(e.relatedTarget)) resetNotchToActive();
  });

  const realignNotch = () => {
    const current = navLinksEl.querySelector('.nav-link.is-tab-active') || activeNavLink;
    moveNotch(current, false);
  };

  window.addEventListener('resize', realignNotch);

  // Les polices Google Fonts chargent en `display: swap` : leur arrivée
  // peut changer la largeur des liens après le premier calcul de l'encoche.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(realignNotch);
  }
}

// Année automatique dans le footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Carrousel du hero — navigation manuelle uniquement (pas de défilement auto)
const heroTrack = document.getElementById('hero-track');
const heroPrev = document.getElementById('hero-prev');
const heroNext = document.getElementById('hero-next');
const heroDotsContainer = document.getElementById('hero-dots');

if (heroTrack && heroPrev && heroNext && heroDotsContainer) {
  const heroSlides = heroTrack.querySelectorAll('.hero-slide');
  const heroDots = heroDotsContainer.querySelectorAll('.hero-dot');
  const heroCarousel = heroTrack.closest('.hero-carousel');
  let heroIndex = 0;

  const goToHeroSlide = (index) => {
    const total = heroSlides.length;
    heroIndex = (index + total) % total;
    heroTrack.style.transform = `translateX(-${heroIndex * 100}%)`;
    heroDots.forEach((dot, i) => {
      const isActive = i === heroIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  };

  heroPrev.addEventListener('click', () => goToHeroSlide(heroIndex - 1));
  heroNext.addEventListener('click', () => goToHeroSlide(heroIndex + 1));
  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToHeroSlide(i));
  });

  // Navigation au clavier (flèches gauche/droite) quand le carrousel a le focus
  heroCarousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToHeroSlide(heroIndex - 1);
    if (e.key === 'ArrowRight') goToHeroSlide(heroIndex + 1);
  });

  // Swipe tactile
  let heroTouchStartX = 0;
  heroTrack.addEventListener('touchstart', (e) => {
    heroTouchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  heroTrack.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - heroTouchStartX;
    if (Math.abs(deltaX) > 40) {
      goToHeroSlide(deltaX < 0 ? heroIndex + 1 : heroIndex - 1);
    }
  }, { passive: true });
}

// Frise chronologique "Jour 1 / Jour 2 / En ligne" — déclenche le remplissage
// de la barre au scroll, une seule fois.
const timeline = document.getElementById('timeline');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (timeline) {
  if (prefersReducedMotion) {
    timeline.classList.add('is-visible');
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(timeline);
  } else {
    timeline.classList.add('is-visible');
  }
}
