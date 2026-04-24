'use strict';

/* ===================================
   Scroll Progress Bar
=================================== */
const progressBar = document.getElementById('scrollProgress');

function updateProgress() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ===================================
   Header Scroll Effect
=================================== */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ===================================
   Mobile Menu
=================================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ===================================
   Smooth Scroll
=================================== */
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===================================
   Scroll Reveal (IntersectionObserver)
=================================== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-item').forEach(el => revealObserver.observe(el));

/* ===================================
   Counter Animation
=================================== */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero__stats, .vision__numbers').forEach(el => {
  counterObserver.observe(el);
});

/* ===================================
   Mouse Parallax on Background Orbs
=================================== */
const orbs = document.querySelectorAll('[data-parallax]');

document.addEventListener('mousemove', e => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  orbs.forEach(orb => {
    const speed = parseFloat(orb.dataset.parallax);
    const x = dx * speed * 60;
    const y = dy * speed * 60;
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
}, { passive: true });

/* ===================================
   Button Ripple Effect
=================================== */
document.querySelectorAll('.btn-ripple').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ===================================
   Works Filter
=================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    workCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
      if (show) card.style.animation = 'fadeSlide 0.35s ease forwards';
    });
  });
});

/* ===================================
   Testimonials Slider
=================================== */
const slides = document.querySelectorAll('.testimonial-slide');
const tdots  = document.querySelectorAll('.tdot');
let current  = 0;
let autoTimer;

function goToSlide(idx) {
  slides[current].classList.remove('active');
  tdots[current].classList.remove('active');
  current = idx;
  slides[current].classList.add('active');
  tdots[current].classList.add('active');
}

function startAuto() { autoTimer = setInterval(() => goToSlide((current + 1) % slides.length), 5000); }

tdots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(autoTimer);
    goToSlide(i);
    startAuto();
  });
});
startAuto();

/* ===================================
   FAQ Accordion
=================================== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item     = btn.closest('.faq-item');
    const answer   = item.querySelector('.faq-a');
    const inner    = item.querySelector('.faq-a__inner');
    const isOpen   = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    document.querySelectorAll('.faq-q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.faq-item').querySelector('.faq-a').style.maxHeight = '0';
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = inner.scrollHeight + 36 + 'px';
    }
  });
});

/* ===================================
   Active Nav Link on Scroll
=================================== */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

/* ===================================
   Contact Form
=================================== */
const contactForm  = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const modalClose   = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = '送信中...';
  btn.disabled = true;
  setTimeout(() => {
    contactForm.reset();
    btn.textContent = original;
    btn.disabled = false;
    successModal.classList.add('active');
  }, 900);
});

function closeModal() { successModal.classList.remove('active'); }
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ===================================
   Scroll to Top
=================================== */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===================================
   Page Load — Hero Entrance
=================================== */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal-item').forEach((el, i) => {
    el.style.setProperty('--reveal-delay', (i * 0.18) + 's');
    setTimeout(() => el.classList.add('revealed'), 80 + i * 180);
  });
});
