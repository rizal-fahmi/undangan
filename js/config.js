// ===== KONFIGURASI APLIKASI =====
//
// Di Netlify: set environment variables:
//   SUPABASE_URL       = https://xxx.supabase.co
//   SUPABASE_ANON_KEY  = eyJ...
//
// Nilai di-inject via snippet Netlify ke window.ENV (lihat netlify.toml).
// Untuk local dev: ganti nilai __LOCAL__ di bawah, atau buat file .env (sudah di .gitignore).

const _env = (typeof window !== 'undefined' && window.ENV) || {};

export const CONFIG = {
  supabaseUrl:     _env.SUPABASE_URL     || '__SUPABASE_URL__',
  supabaseAnonKey: _env.SUPABASE_ANON_KEY || '__SUPABASE_ANON_KEY__',
  tableName:       'wishes',
  targetDate:      new Date('July 19, 2026 10:00:00'),
  siteUrl:         _env.SITE_URL || 'https://fahmi-utia.web.id',
};
