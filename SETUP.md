# Setup Undangan Digital — Fahmi & Utia

## 1. Setup Database Ucapan (Supabase — Gratis)

### Buat Project Supabase
1. Buka https://supabase.com dan daftar/login
2. Klik **New Project**, isi nama dan password
3. Tunggu project siap (~2 menit)

### Buat Tabel `wishes`
Buka **SQL Editor** di Supabase, jalankan:

```sql
create table wishes (
  id bigserial primary key,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Allow public read & insert (tanpa login)
alter table wishes enable row level security;

create policy "Anyone can read wishes"
  on wishes for select using (true);

create policy "Anyone can insert wishes"
  on wishes for insert with check (true);
```

### Dapatkan Credentials
1. Buka **Settings → API**
2. Copy **Project URL** → paste ke `SUPABASE_URL` di `js/script.js`
3. Copy **anon/public key** → paste ke `SUPABASE_ANON_KEY` di `js/script.js`

---

## 2. Deploy ke Netlify (Gratis)

### Cara Mudah — Drag & Drop
1. Buka https://app.netlify.com
2. Daftar/login
3. Di dashboard, drag folder `undangan` ke area **"Deploy manually"**
4. Selesai! Netlify langsung kasih URL seperti `https://xyz.netlify.app`

### Custom Domain (Opsional)
- Di Netlify: **Site settings → Domain management → Add custom domain**

---

## 3. Kirim Link ke Tamu

Format link dengan nama tamu:
```
https://url-anda.netlify.app/?to=Nama+Tamu
```

Contoh:
```
https://fahmiutia.netlify.app/?to=Teuku+Abdullah
```

---

## Struktur File
```
undangan/
├── index.html          ← Halaman utama
├── css/style.css       ← Styling
├── js/script.js        ← Logic + database
├── assets/music/       ← File audio
├── netlify.toml        ← Konfigurasi Netlify
└── _redirects          ← URL routing
```
