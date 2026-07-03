// ===== DATABASE LAYER =====
// Supabase jika sudah dikonfigurasi, fallback ke localStorage
import { CONFIG } from './config.js';

const useSupabase = CONFIG.supabaseUrl !== 'YOUR_SUPABASE_URL';
let _supabase = null;

/** Inisialisasi Supabase client secara async (load SDK dari CDN) */
export function initDB() {
  return new Promise((resolve) => {
    if (!useSupabase) { resolve(false); return; }

    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s.onload = () => {
      _supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      resolve(true);
    };
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

/** Ambil semua wishes, terbaru di atas */
export async function fetchWishes() {
  if (_supabase) {
    const { data, error } = await _supabase
      .from(CONFIG.tableName)
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  }
  return _getLocal();
}

/** Kirim wish baru */
export async function insertWish(name, message) {
  if (_supabase) {
    const { error } = await _supabase
      .from(CONFIG.tableName)
      .insert([{ name, message }]);
    if (error) throw error;
    return;
  }
  _saveLocal(name, message);
}

/** Subscribe realtime Supabase — panggil callback setiap ada INSERT */
export function subscribeWishes(callback) {
  if (!_supabase) return;
  _supabase.channel('wishes-rt')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: CONFIG.tableName }, () => callback())
    .subscribe();
}

// ---- localStorage helpers ----
function _getLocal() {
  try { return JSON.parse(localStorage.getItem('wedding_wishes') || '[]'); }
  catch { return []; }
}

function _saveLocal(name, message) {
  const list = _getLocal();
  list.unshift({ id: Date.now(), name, message, created_at: new Date().toISOString() });
  localStorage.setItem('wedding_wishes', JSON.stringify(list));
}
