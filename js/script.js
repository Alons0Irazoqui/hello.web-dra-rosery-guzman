/* ==========================================================================
   Dra. Rosemary Guzmán Santa Cruz — Cardiología Pediátrica
   Script principal: preloader, nav, partículas, typewriter, scroll reveal,
   formulario de contacto y fallback de imágenes.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 1. Preloader ---------------- */
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
    setTimeout(() => preloader.remove(), 800);
  };
  window.addEventListener('load', () => setTimeout(hidePreloader, 500));
  // Respaldo por si el evento "load" tarda demasiado (imágenes externas lentas)
  setTimeout(hidePreloader, 3500);

  /* ---------------- 2. Header: estado al hacer scroll ---------------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------------- 3. Menú móvil ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-active');
      navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-active');
        navLinks.classList.remove('is-open');
      });
    });
  }

  /* ---------------- 4. Scroll reveal (IntersectionObserver) ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------- 5. Typewriter en el título del Hero ---------------- */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'en las manos correctas.',
    'con precisión y calidez.',
    'protegido por la experiencia.',
    'nuestra razón de ser.'
  ];

  if (typedEl && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typedEl.textContent = currentPhrase.substring(0, charIndex);
      } else {
        charIndex++;
        typedEl.textContent = currentPhrase.substring(0, charIndex);
      }

      let delay = isDeleting ? 40 : 65;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      setTimeout(type, delay);
    };

    type();
  } else if (typedEl) {
    typedEl.textContent = phrases[0];
  }

  /* ---------------- 6. Partículas de fondo en el Hero (canvas) ---------------- */
  const canvas = document.getElementById('hero-particles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let animationId;

    const colors = ['rgba(201,162,39,0.8)', 'rgba(179,57,81,0.8)', 'rgba(255,255,255,0.6)'];

    const resize = () => {
      const hero = canvas.closest('.hero');
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    };

    const initParticles = () => {
      const count = Math.min(90, Math.floor((width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
    };

    const linkDistance = 130;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(201,162,39,${0.14 * (1 - dist / linkDistance)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const start = () => {
      resize();
      initParticles();
      cancelAnimationFrame(animationId);
      draw();
    };

    start();
    window.addEventListener('resize', () => {
      clearTimeout(canvas._resizeTimer);
      canvas._resizeTimer = setTimeout(start, 200);
    });
  }

  /* ---------------- 7. Año dinámico en el footer ---------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- 8. Formulario de contacto ---------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // NOTA PARA DESARROLLO: conectar a un servicio real de envío
      // (ej. Formspree, EmailJS o backend propio) antes de publicar.
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        if (formSuccess) {
          formSuccess.classList.add('is-visible');
          setTimeout(() => formSuccess.classList.remove('is-visible'), 6000);
        }
      }, 900);
    });
  }

  /* ---------------- 9. Fallback de imágenes rotas ---------------- */
  window.phFallback = (imgEl) => {
    imgEl.onerror = null;
    const label = imgEl.getAttribute('data-fallback-label') || 'Fotografía próxima​mente';
    const svg = `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0B2545"/>
            <stop offset="100%" stop-color="#B33951"/>
          </linearGradient>
        </defs>
        <rect width="800" height="1000" fill="url(#g)"/>
        <text x="50%" y="50%" fill="#F1F2F4" font-family="Georgia, serif" font-size="34"
          text-anchor="middle" dominant-baseline="middle">${label}</text>
      </svg>
    `)}`;
    imgEl.src = svg;
  };
});
