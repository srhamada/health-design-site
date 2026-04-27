/* ============================================
   HEADER: scroll state
   ============================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================
   HAMBURGER MENU
   ============================================ */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================
   SCROLL ANIMATION (Intersection Observer)
   ============================================ */
const animTargets = document.querySelectorAll(
  '.service-card, .value-card, .reason-item, .about__lead, .about__body, .section__head, .hero__content, .hero__visual, .contact__info, .contact__form, .company__inner, .concerns__item, .concerns__cta-note, .message__lead, .message__body, .message__actions'
);

animTargets.forEach((el, i) => {
  el.classList.add('fade-up');
  // Stagger children of grid containers
  const parent = el.closest('.services__grid, .reasons__grid, .about__values');
  if (parent) {
    const siblings = Array.from(parent.children);
    const idx = siblings.indexOf(el);
    if (idx < 5) el.classList.add(`fade-up-delay-${idx + 1}`);
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animTargets.forEach(el => observer.observe(el));

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
const form = document.getElementById('contactForm');
const successMsg = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Helper
    const showError = (id, msg) => {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
      if (msg) valid = false;
    };
    const clearErrors = () => {
      document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
      document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
        el.style.borderColor = '';
      });
    };

    clearErrors();

    // Company
    const company = form.company.value.trim();
    if (!company) showError('error-company', '会社名を入力してください。');

    // Name
    const name = form.name.value.trim();
    if (!name) showError('error-name', 'お名前を入力してください。');

    // Email
    const email = form.email.value.trim();
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError('error-email', 'メールアドレスを入力してください。');
    } else if (!emailReg.test(email)) {
      showError('error-email', '正しいメールアドレスの形式で入力してください。');
    }

    // Message
    const message = form.message.value.trim();
    if (!message) showError('error-message', 'お問い合わせ内容を入力してください。');

    // Privacy
    if (!form.privacy.checked) {
      showError('error-privacy', 'プライバシーポリシーへの同意が必要です。');
    }

    if (valid) {
      // Show success (static demo — replace with fetch() for real backend)
      successMsg.classList.add('show');
      form.reset();
      form.style.display = 'none';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // Live validation feedback
  form.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        const errorEl = document.getElementById('error-' + input.id);
        if (errorEl) errorEl.textContent = '';
      }
    });
  });
}

/* ============================================
   SMOOTH ANCHOR OFFSET (fixed header)
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
