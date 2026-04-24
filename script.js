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
   Contact Form — FormSubmit.co へ隠しiframe経由で送信
   CORSを回避するため、AJAXではなく通常のPOSTを
   不可視iframeに投げる方式を採用
   初回送信時にhyouma48483@gmail.com宛へ
   アクティベーションメールが届くので要リンククリック
=================================== */
const contactForm  = document.getElementById('contactForm');
const contactFrame = document.getElementById('contactFormFrame');
const formSubject  = document.getElementById('formSubject');
const successModal = document.getElementById('successModal');
const modalClose   = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');

function buildMailtoFallback() {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const company = document.getElementById('company').value.trim();
  const plan    = document.getElementById('plan').value || '未選択';
  const message = document.getElementById('message').value.trim();

  const body = [
    `お名前: ${name}`,
    `メールアドレス: ${email}`,
    `会社名: ${company}`,
    `ご興味のあるプラン: ${plan}`,
    '',
    '【AI化したい業務・お困りの課題】',
    message
  ].join('\n');
  const subject = `【NEXUS AI】お問い合わせ - ${company}`;
  return `mailto:hyouma48483@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

let submissionInFlight = false;
let submissionTimer    = null;

function finishSubmission(success, btn, originalLabel) {
  if (!submissionInFlight) return;
  submissionInFlight = false;
  clearTimeout(submissionTimer);
  btn.textContent = originalLabel;
  btn.disabled    = false;

  if (success) {
    contactForm.reset();
    successModal.classList.add('active');
  } else {
    const useMailto = confirm(
      '送信処理がタイムアウトしました。\nお使いのメールソフトを起動して送信しますか？\n（「キャンセル」でもう一度試せます）'
    );
    if (useMailto) window.location.href = buildMailtoFallback();
  }
}

// iframeがレスポンスを受け取った時点で成功とみなす
// （CORSで中身は読めないが、loadが発火すれば
//  FormSubmit.coへPOSTが到達している）
contactFrame.addEventListener('load', () => {
  if (!submissionInFlight) return;  // 初期ロードは無視
  const btn = contactForm.querySelector('button[type="submit"]');
  finishSubmission(true, btn, btn.dataset.original || '無料相談を申し込む →');
});

contactForm.addEventListener('submit', () => {
  // e.preventDefault()は呼ばない（iframeへ通常POSTさせる）
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.dataset.original = btn.textContent;
  btn.textContent = '送信中...';
  btn.disabled   = true;

  // 件名に会社名を動的に差し込む
  const company = document.getElementById('company').value.trim();
  if (formSubject && company) {
    formSubject.value = `【NEXUS AI】新規お問い合わせ - ${company}`;
  }

  submissionInFlight = true;
  // 15秒以内にiframeのloadが発火しなければフォールバック
  submissionTimer = setTimeout(() => {
    finishSubmission(false, btn, btn.dataset.original);
  }, 15000);
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
