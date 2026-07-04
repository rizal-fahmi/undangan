// ===== MUSIC CONTROLLER =====

const audio  = document.getElementById('bgMusic');
const btn    = document.getElementById('toggleMusicBtn');
const icon   = document.getElementById('musicIcon');
const label  = document.getElementById('musicLabel');

let playing  = false;
let volume   = 1;

export function playMusic() {
  if (!audio) return;
  audio.volume = volume;
  audio.play()
    .then(() => { playing = true; _updateUI(); })
    .catch(() => { playing = false; });
}

export function pauseMusic() {
  audio?.pause();
  playing = false;
  _updateUI();
}

export function isPlaying() { return playing; }

function _updateUI() {
  if (!icon) return;
  if (playing) {
    icon.className = 'fa-solid fa-compact-disc text-base animate-spin-slow';
    btn?.setAttribute('aria-label', 'Pause musik');
    btn?.classList.add('music-playing');
    if (label) label.textContent = 'Pause';
  } else {
    icon.className = 'fa-solid fa-volume-xmark text-base';
    btn?.setAttribute('aria-label', 'Play musik');
    btn?.classList.remove('music-playing');
    if (label) label.textContent = 'Play';
  }
}

export function initMusic() {
  if (!btn) return;
  btn.setAttribute('aria-label', 'Play musik');

  // Toggle play/pause on click
  btn.addEventListener('click', () => {
    playing ? pauseMusic() : playMusic();
  });

  // Long-press (500ms) buka panel volume
  let pressTimer = null;
  btn.addEventListener('pointerdown', () => {
    pressTimer = setTimeout(() => {
      const panel = document.getElementById('volumePanel');
      if (panel) panel.classList.toggle('hidden');
    }, 500);
  });
  btn.addEventListener('pointerup', () => clearTimeout(pressTimer));
  btn.addEventListener('pointerleave', () => clearTimeout(pressTimer));

  // Volume slider
  const volSlider = document.getElementById('volumeSlider');
  if (volSlider) {
    volSlider.value = 100;
    volSlider.addEventListener('input', () => {
      volume = Number(volSlider.value) / 100;
      if (audio) audio.volume = volume;
    });
  }

  // Tutup volume panel jika tap di luar
  document.addEventListener('pointerdown', (e) => {
    const panel = document.getElementById('volumePanel');
    const ctrl  = document.getElementById('musicControl');
    if (panel && !ctrl?.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });

  // Pause otomatis saat tab/browser tidak aktif (khusus mobile)
  // Di HP: saat browser di-minimize atau layar mati → musik berhenti
  // Di desktop: tidak berpengaruh karena tab tetap aktif di background
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && playing) {
        pauseMusic();
      }
    });
  }
}
