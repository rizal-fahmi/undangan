// ===== WISHES UI =====
import { fetchWishes, insertWish, subscribeWishes } from './db.js';
import { showToast } from './ui.js';

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g,
    c => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c]));
}

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch { return 'Baru saja'; }
}

/** Render daftar ucapan ke DOM */
export function renderWishes(wishes) {
  const list  = document.getElementById('wishesList');
  const count = document.getElementById('wishesCount');
  const loading = document.getElementById('loadingWishes');
  if (loading) loading.remove();

  count.textContent = wishes.length;
  list.innerHTML = '';

  if (wishes.length === 0) {
    list.innerHTML = `
      <div class="wishes-empty">
        <i class="fa-regular fa-heart text-xl mb-2 block opacity-30"></i>
        Belum ada ucapan. Jadilah yang pertama ✨
      </div>`;
    return;
  }

  wishes.forEach((w, i) => {
    const el = document.createElement('div');
    el.className = 'wish-card';
    el.style.animationDelay = `${i * 60}ms`;
    el.innerHTML = `
      <div class="wish-header">
        <span class="wish-avatar">${escapeHtml(w.name[0]?.toUpperCase() || '?')}</span>
        <strong class="wish-name">${escapeHtml(w.name)}</strong>
        <span class="wish-time">${formatDate(w.created_at)}</span>
      </div>
      <p class="wish-msg">${escapeHtml(w.message)}</p>`;
    list.appendChild(el);
  });
}

/** Load ulang dari DB lalu render */
export async function loadWishes() {
  try {
    const data = await fetchWishes();
    renderWishes(data);
  } catch (err) {
    console.warn('loadWishes error:', err);
    renderWishes([]);
  }
}

/** Setup form submit + realtime subscription */
export function initWishes() {
  // Realtime update
  subscribeWishes(() => loadWishes());

  const form = document.getElementById('wishesForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('wishName');
    const msgEl  = document.getElementById('wishMessage');
    const btn    = document.getElementById('btnSubmitWish');

    const name    = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) return;

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...`;

    try {
      await insertWish(name, message);
      nameEl.value = '';
      msgEl.value  = '';
      showToast('Ucapan terkirim 🙏');
      await loadWishes();
    } catch (err) {
      console.error('insertWish error:', err);
      showToast('Gagal mengirim, coba lagi.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<i class="fa-regular fa-paper-plane"></i> Kirim Ucapan`;
    }
  });
}
