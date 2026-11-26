/* Fastrex — interaksi halaman (typewriter hero & animasi muncul saat scroll) */
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

  // 3. POP-UP ENTRANCE FOR OTHER CARDS, CTAS, AND BADGES (STAGGERED WITH SPRING POP FEEL)
  const popUpElements = document.querySelectorAll('.pop-up-item');
  if ('IntersectionObserver' in window) {
    const popUpObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Check sibling index for natural staggered entrance
          const parent = entry.target.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll('.pop-up-item')) : [];
          const siblingIndex = siblings.indexOf(entry.target);
          const delay = siblingIndex >= 0 ? siblingIndex * 80 : 40;

          setTimeout(() => {
            entry.target.classList.add('is-revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px'
    });

    popUpElements.forEach(el => popUpObserver.observe(el));
  } else {
    popUpElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 4. Standard section headers reveal
  const standardReveals = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    standardReveals.forEach(el => revealObserver.observe(el));
  } else {
    standardReveals.forEach(el => el.classList.add('is-revealed'));
  }

});
