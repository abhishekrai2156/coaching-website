/* =========================================
   RAITRENDS – JavaScript Interactions
   ========================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const isOpen = navLinksEl.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
  });
});

// ---- FLOATING PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  const colors = ['#6c63ff', '#00d4aa', '#ff6b6b', '#ffd700', '#8b83ff'];

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 6 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 12 + 8;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      bottom: -10px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      box-shadow: 0 0 ${size * 2}px ${color}80;
    `;
    container.appendChild(particle);
  }
}
createParticles();

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 16);
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .course-card, .result-card, .testimonial-card, .pillar, .faq-item, .brand-pill').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// ---- COUNTER OBSERVER ----
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroSection = document.querySelector('.hero-stats');
if (heroSection) counterObserver.observe(heroSection);
const resultsSection = document.querySelector('.results-grid');
if (resultsSection) counterObserver.observe(resultsSection);

// ---- RESULT BAR ANIMATION ----
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.result-fill').forEach(fill => {
        fill.classList.add('animated');
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (resultsSection) barObserver.observe(resultsSection.parentElement);

// ---- TESTIMONIAL SLIDER ----
const slider = document.querySelector('.testimonials-slider');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const cards = document.querySelectorAll('.testimonial-card');
const cardWidth = 360 + 24; // card width + gap
let currentIndex = 0;
let autoSlideInterval;

function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, cards.length - 1));
  const offset = currentIndex * cardWidth;
  slider.style.transform = `translateX(-${offset}px)`;
  dots.forEach(d => d.classList.remove('active'));
  if (dots[currentIndex]) dots[currentIndex].classList.add('active');
}

function nextSlide() {
  goToSlide((currentIndex + 1) % cards.length);
}

function prevSlide() {
  goToSlide((currentIndex - 1 + cards.length) % cards.length);
}

nextBtn?.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
prevBtn?.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.getAttribute('data-index')));
    resetAutoSlide();
  });
});

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4500);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

startAutoSlide();

// Touch swipe support
let touchStartX = 0;
slider?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
slider?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 40) { diff > 0 ? nextSlide() : prevSlide(); resetAutoSlide(); }
});

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  btn?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- CONTACT FORM ----
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const btnSpan = btn.querySelector('span');
  btnSpan.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    btnSpan.textContent = 'Send Message';
    btn.disabled = false;

    // Show toast
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }, 1500);
});

// ---- SMOOTH SCROLL FOR ALL ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- STAGGER REVEAL FOR GRIDS ----
function staggerReveal(selector, delayStep = 100) {
  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allInGroup = entry.target.parentElement.querySelectorAll(selector.split(' ').pop());
        allInGroup.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * delayStep);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

staggerReveal('.services-grid .service-card', 100);
staggerReveal('.results-grid .result-card', 120);
staggerReveal('.brands-logos .brand-pill', 60);

// ---- CURSOR GLOW EFFECT (Desktop only) ----
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// ---- HERO PARALLAX ----
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg-img');
  if (hero && window.innerWidth > 768) {
    hero.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

console.log('%c⚡ RaiTrends', 'font-size:20px;font-weight:bold;background:linear-gradient(135deg,#6c63ff,#00d4aa);-webkit-background-clip:text;color:transparent;');
console.log('%cDigital Marketing Agency | hello@raitrends.in', 'color:#8892a4;font-size:12px;');
