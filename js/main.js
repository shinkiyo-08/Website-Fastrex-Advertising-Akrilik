/* Fastrex — interaksi halaman (typewriter hero, animasi scroll, menu mobile) */
document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC LOOPING KEYWORD TYPEWRITER ANIMATION
  // Loops between: "Laser Cutting", "Neon Box", "Huruf Timbul"
  const typewriterTarget = document.getElementById('typewriter-text');
  const phrases = ["Laser Cutting", "Neon Box", "Huruf Timbul"];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typewriterTarget) {
    if (isReducedMotion) {
      typewriterTarget.textContent = phrases[0];
    } else {
      function loopTypewriter() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
          charIdx--;
          typewriterTarget.textContent = currentPhrase.substring(0, charIdx);
        } else {
          charIdx++;
          typewriterTarget.textContent = currentPhrase.substring(0, charIdx);
        }

        let speed = isDeleting ? 45 : 75;

        // When full word has been typed
        if (!isDeleting && charIdx === currentPhrase.length) {
          speed = 2000; // Pause display
          isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          speed = 450; // Pause before typing next phrase
        }

        setTimeout(loopTypewriter, speed);
      }

      // Initial start
      setTimeout(loopTypewriter, 350);
    }
  }

  // 2. TAGLINE & SUB-HEADLINE: SLIDE FADE DARI KIRI KE KANAN
  const slideFadeElements = document.querySelectorAll('.slide-fade-left');
  setTimeout(() => {
    slideFadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('is-revealed');
      }, index * 180 + 100);
    });
  }, 120);

  // 3. ANIMASI MUNCUL SAAT SCROLL (fade + naik, bertahap per kelompok kartu)
  const revealEls = document.querySelectorAll('.pop-up-item, .reveal-item');
  if ('IntersectionObserver' in window && !isReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const group = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.matches('.pop-up-item, .reveal-item')) : [];
        el.style.transitionDelay = Math.min(Math.max(group.indexOf(el), 0), 5) * 90 + 'ms';
        el.classList.add('is-revealed');
        io.unobserve(el);
        setTimeout(() => { el.style.transitionDelay = ''; }, 1200); // supaya efek hover tetap responsif
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-revealed'));
  }

  // 4. PROGRES SCROLL & BAYANGAN HEADER
  const bar = document.getElementById('scroll-progress');
  const header = document.querySelector('header');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
      if (header) header.classList.toggle('header-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 5. MENU POP-UP MOBILE (hamburger)
  const menu = document.getElementById('menu-modal');
  const openBtn = document.getElementById('menu-toggle');
  if (menu && openBtn) {
    const setMenu = (open) => {
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      openBtn.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('menu-open', open);
      (open ? menu.querySelector('[data-menu-close]') : openBtn).focus();
    };
    openBtn.addEventListener('click', () => setMenu(true));
    menu.addEventListener('click', (e) => {
      if (e.target === menu || e.target.closest('[data-menu-close]') || e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }
});
