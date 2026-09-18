/**
 * Portfolio behaviour — small, dependency-free, progressive.
 *
 * 1. Theme toggle      — persists to localStorage, respects prefers-color-scheme
 * 2. Mobile menu       — accessible disclosure with Escape / outside-click close
 * 3. Active nav link   — IntersectionObserver marks the section in view
 * 4. Scroll reveal     — one-shot fade/rise, skipped under prefers-reduced-motion
 * 5. Copy email        — clipboard write with a short toast
 * 6. Headshot fallback — hides the photo block if assets/photo.jpg is missing
 *
 * The initial theme is applied by an inline script in <head> (before first
 * paint) so there is no flash; this module only wires the toggle.
 */
import './style.css';

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ------------------------------------------------------------------ 1. Theme */
function initTheme() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  const label = () =>
    toggle.setAttribute(
      'aria-label',
      root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );

  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this visit */
    }
    label();
  });

  // Follow OS changes only while the user has not chosen explicitly.
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    let stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {
      /* ignore */
    }
    if (!stored) {
      root.dataset.theme = e.matches ? 'light' : 'dark';
      label();
    }
  });

  label();
}

/* ------------------------------------------------------------ 2. Mobile menu */
function initMenu() {
  const button = document.querySelector('[data-menu-button]');
  const panel = document.querySelector('[data-menu-panel]');
  if (!button || !panel) return;

  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    root.classList.toggle('overflow-hidden', open && window.innerWidth < 768);
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (
      button.getAttribute('aria-expanded') === 'true' &&
      !panel.contains(e.target) &&
      !button.contains(e.target)
    ) {
      setOpen(false);
    }
  });

  // If the viewport grows to desktop while the drawer is open, reset state.
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ------------------------------------------------------ 3. Active nav section */
function initActiveNav() {
  const links = [...document.querySelectorAll('[data-nav] a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);

  const setActive = (id) => {
    for (const [key, a] of byId) {
      if (key === id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  // A band just below the sticky nav decides which section is "current".
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((s) => observer.observe(s));

  // Clear highlight when scrolled back to the hero (above the first section).
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < 200) setActive(null);
    },
    { passive: true }
  );
}

/* ---------------------------------------------------------- 4. Scroll reveal */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------- 5. Copy email */
function initCopyEmail() {
  const button = document.querySelector('[data-copy-email]');
  const toast = document.querySelector('[data-toast]');
  if (!button) return;

  const email = button.dataset.copyEmail;
  let timer;

  const announce = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.show = 'true';
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.dataset.show = 'false';
    }, 1800);
  };

  // Legacy fallback for contexts where the async Clipboard API is unavailable
  // or rejected (insecure origin, unfocused document, older browsers).
  const legacyCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = email;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-100px;left:-100px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  };

  button.addEventListener('click', async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      copied = legacyCopy();
    }
    announce(copied ? 'Email copied' : 'Copy failed — select the address above');
  });
}

/* ------------------------------------------------------ 6. Headshot fallback */
function initHeadshot() {
  const wrapper = document.querySelector('[data-headshot]');
  const img = wrapper?.querySelector('img');
  if (!wrapper || !img) return;

  const hide = () => {
    wrapper.hidden = true;
  };

  // Image may have already failed before this script ran.
  if (img.complete && img.naturalWidth === 0) hide();
  img.addEventListener('error', hide);
}

/* --------------------------------------------------------------------- Boot */
initTheme();
initMenu();
initActiveNav();
initReveal();
initCopyEmail();
initHeadshot();

// Keep the footer year honest without a rebuild.
const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
