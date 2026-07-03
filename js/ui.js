// ===== UI HELPERS =====

let _toastTimer = null;

/** Tampilkan toast notifikasi */
export function showToast(msg, type = 'success') {
  const toast = document.getElementById('customToast');
  const text  = document.getElementById('toastText');
  const icon  = document.getElementById('toastIcon');
  if (!toast) return;

  text.textContent = msg;
  icon.className = type === 'error'
    ? 'fa-solid fa-circle-xmark text-red-400 text-sm'
    : 'fa-solid fa-circle-check text-emerald-400 text-sm';

  toast.classList.remove('toast-hide');
  toast.classList.add('toast-show');

  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.classList.remove('toast-hide'), 400);
  }, 2800);
}

/** Copy teks elemen ke clipboard */
export function copyText(elId, btnId) {
  const text = document.getElementById(elId)?.innerText || '';
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    Object.assign(ta.style, { position:'fixed', opacity:'0' });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy'); // eslint-disable-line
    ta.remove();
  });
  showToast('Berhasil disalin!');
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = `<i class="fa-solid fa-check"></i> Tersalin!`;
  btn.classList.add('btn-success');
  setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('btn-success'); }, 2500);
}

/** Inisialisasi scroll reveal dengan IntersectionObserver */
let _revealObserver = null;
export function initReveal() {
  // Disconnect old observer before re-init
  if (_revealObserver) _revealObserver.disconnect();

  _revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        _revealObserver.unobserve(e.target); // Stop watching once revealed
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal:not(.active)').forEach(el => _revealObserver.observe(el));
}

/** Buat partikel dekoratif melayang */
export function createParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;
  const symbols = ['✦', '✧', '◇', '·', '○'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.animationDelay    = Math.random() * 14 + 's';
    p.style.animationDuration = 12 + Math.random() * 10 + 's';
    p.style.fontSize          = 7 + Math.random() * 8 + 'px';
    container.appendChild(p);
  }
}
