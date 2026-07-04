// ===== ENTRY POINT =====
import { loadPartials }              from './partials.js';
import { initDB }                    from './db.js';
import { initWishes, loadWishes }    from './wishes.js';
import { startCountdown }            from './countdown.js';
import { playMusic, initMusic }      from './music.js';
import { initReveal, createParticles, copyText } from './ui.js';

// ---- Guest name from URL param ?to=Nama-Tamu ----
function getGuestName() {
  const p = new URLSearchParams(window.location.search).get('to');
  if (!p) return 'Tamu Undangan';
  // Ganti tanda hubung (-) jadi spasi untuk ditampilkan
  return decodeURIComponent(p).replace(/-/g, ' ');
}

// ---- Open invitation ----
async function openInvitation() {
  // Unlock scroll
  document.getElementById('mainBody').classList.remove('lock-scroll');

  // Animate cover out (slide up + fade)
  const cover = document.getElementById('coverScreen');
  cover.classList.add('cover-exit');
  setTimeout(() => { cover.style.display = 'none'; }, 900);

  // Show main content with fade in
  const main = document.getElementById('mainContent');
  main.classList.remove('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      main.classList.add('opacity-100');
      // Re-run reveal for main content elements
      initReveal();
    });
  });

  // Start all features
  startCountdown();
  playMusic();
  await loadWishes();
  initWishes();
}

// ---- Copy buttons ----
function initCopyButtons() {
  document.getElementById('btnCopyFahmi')
    ?.addEventListener('click', () => copyText('rekFahmi', 'btnCopyFahmi'));
  document.getElementById('btnCopyAlamat')
    ?.addEventListener('click', () => copyText('alamatFahmi', 'btnCopyAlamat'));
  document.getElementById('btnCopyOvo')
    ?.addEventListener('click', () => copyText('rekOvo', 'btnCopyOvo'));
}

// ---- Smooth scroll for anchor links ----
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---- DOM Ready ----
window.addEventListener('DOMContentLoaded', async () => {
  // Load all HTML partials first (cover + main content)
  await loadPartials();

  // Set guest name (element now in DOM after partial load)
  const guestEl = document.getElementById('guestName');
  if (guestEl) guestEl.textContent = getGuestName();

  // Init reveal on cover elements too
  initReveal();

  // Decorative particles
  createParticles();

  // Init music controller
  initMusic();

  // Init DB (loads Supabase SDK if configured)
  await initDB();

  // Bind open invitation button
  document.getElementById('openInvitationBtn')
    ?.addEventListener('click', openInvitation);

  // Copy buttons
  initCopyButtons();

  // Smooth scroll for anchor links
  initSmoothScroll();
});
