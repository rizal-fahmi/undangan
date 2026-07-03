# Setup & Deploy — Undangan Digital Fahmi & Utia

## Struktur File

```
undangan/
├── index.html                 ← Halaman utama undangan
├── generate-undangan/
│   └── index.html             ← Generator link per tamu + kirim WA
├── partials/                  ← Komponen HTML (cover, ayat, couple, dst)
├── js/
│   ├── app.js                 ← Entry point
│   ├── config.js              ← Baca dari window.ENV (di-set di env.js)
│   ├── env.js                 ← ⚠️ TIDAK di-commit (ada di .gitignore)
│   ├── env.example.js         ← Contoh isi env.js
│   └── ...
├── css/style.css
├── assets/
├── netlify.toml
└── .gitignore
```

---

## 1. Setup Supabase (Database Ucapan)

### Buat project
1. Daftar di https://supabase.com
2. New Project → isi nama & password
3. Tunggu ~2 menit

### Buat tabel `wishes`
Buka **SQL Editor**, jalankan:

```sql
create table wishes (
  id         bigserial primary key,
  name       text not null,
  message    text not null,
  created_at timestamptz default now()
);

alter table wishes enable row level security;

create policy "read_public"   on wishes for select using (true);
create policy "insert_public" on wishes for insert with check (true);
```

### Dapatkan credentials
- **Settings → API**
- Copy **Project URL** dan **anon/public key**

---

## 2. Setup env.js (Local Development)

Copy `js/env.example.js` → `js/env.js` dan isi nilai:

```js
window.ENV = {
  SUPABASE_URL:      'https://xxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJ...',
  SITE_URL:          'https://fahmi-utia.web.id',
};
```

> `js/env.js` sudah ada di `.gitignore` — **tidak akan ter-commit ke Git**.

---

## 3. Deploy ke Netlify

### Cara 1 — Hubungkan GitHub (Recommended)

1. Push repo ke GitHub:
   ```
   git remote add origin https://github.com/USERNAME/undangan.git
   git push -u origin main
   ```
2. Buka https://app.netlify.com → **Add new site → Import from Git**
3. Pilih repo → deploy settings sudah otomatis dari `netlify.toml`

### Cara 2 — Drag & Drop
Drag folder `undangan` ke https://app.netlify.com/drop

---

## 4. Set Environment Variables di Netlify

Setelah site live:

1. Netlify Dashboard → **Site configuration → Environment variables**
2. Tambahkan:
   | Key | Value |
   |-----|-------|
   | `SUPABASE_URL` | `https://xxxxx.supabase.co` |
   | `SUPABASE_ANON_KEY` | `eyJ...` |
   | `SITE_URL` | `https://fahmi-utia.web.id` |

3. Buka **Site configuration → Build & deploy → Post processing → Snippet injection**
4. Klik **Add snippet** → pilih **Before `</head>`** → paste:

```html
<script>
window.ENV = {
  SUPABASE_URL:      'NILAI_DARI_ENV_VAR',
  SUPABASE_ANON_KEY: 'NILAI_DARI_ENV_VAR',
  SITE_URL:          'https://fahmi-utia.web.id'
};
</script>
```

> **Catatan:** Netlify snippet injection tidak bisa otomatis substitute env var ke HTML.
> Masukkan nilai asli langsung di snippet (snippet ini tidak ter-commit ke Git).

---

## 5. Custom Domain

1. Netlify → **Domain management → Add custom domain**
2. Masukkan `fahmi-utia.web.id`
3. Update DNS di registrar domain Anda (tambah CNAME ke Netlify)

---

## 6. Kirim Undangan ke Tamu

### Format link manual
```
https://fahmi-utia.web.id/?to=Nama+Tamu
```

### Generator otomatis
Buka: **https://fahmi-utia.web.id/generate-undangan**

Fitur:
- Input banyak nama sekaligus (satu per baris)
- Generate semua link sekaligus
- Tombol **Kirim WA** langsung buka WhatsApp dengan template pesan
- Salin semua link sekaligus

---

## 7. Catatan Keamanan

- **Supabase anon key** bersifat publik by design (digunakan di browser)
- Keamanan data dijaga oleh **Row Level Security (RLS)** di Supabase
- Untuk mencegah spam, bisa tambahkan rate limiting di Supabase (Policies)
- Halaman `/generate-undangan` hanya berisi HTML statis, tidak ada auth
