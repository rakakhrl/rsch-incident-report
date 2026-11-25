# Sistem Pelaporan Insiden Rumah Sakit (Avicenna Incident Report)
### Rumah Sakit Charitas / Avicenna Healthcare Solution

Aplikasi pelaporan insiden terpadu berbasis web modern dengan pendekatan **Mobile-First (diutamakan untuk penggunaan smartphone oleh tenaga kesehatan di lokasi kejadian/Point-of-Care)** dan sepenuhnya responsif serta adaptif untuk dibuka pada peramban web di perangkat keras apa saja (komputer meja/PC Nurse Station, laptop, maupun tablet).

Sistem ini mendigitalisasi pelaporan insiden keselamatan pasien (IKP), keselamatan dan kesehatan kerja karyawan (K3RS), ketidaksesuaian budaya keselamatan (NCSF), serta kanal pelaporan pelanggaran rahasia (*Whistleblowing System* / WBS) dengan proteksi anti-bot mandiri berbasis **ALTCHA CAPTCHA**.

---

## 🛡️ Integrasi Keamanan CAPTCHA Mandiri (ALTCHA)

Setiap formulir di dalam aplikasi ini telah dilengkapi dengan widget verifikasi Proof-of-Work (PoW) **ALTCHA** yang terhubung ke layanan mikro **`captcha-server`** mandiri (*self-hosted*):
- **100% Bebas Biaya & Tanpa Cloud Eksternal**: Pembuatan tantangan dan verifikasi tanda tangan kriptografi (HMAC-SHA256 / PBKDF2) diproses secara lokal pada server rumah sakit tanpa ketergantungan layanan pihak ketiga (Google reCAPTCHA atau Cloudflare Turnstile).
- **Proteksi Anti Replay Attack**: Setiap solusi tantangan yang telah diselesaikan dicatat ke dalam cache memori anti-replay sehingga tidak dapat dipakai ulang untuk manipulasi data atau serangan *brute force*.
- **Ramah Pengguna**: Verifikasi berjalan cepat tanpa teka-teki gambar yang menyulitkan petugas medis atau staf rumah sakit.

### Formulir yang Dilindungi:
1. **Formulir Login Karyawan**: Melindungi autentikasi staf dari serangan *credential stuffing* dan *brute force*.
2. **Formulir Whistleblowing**: Melindungi kanal publik anonim dari *spamming* dan pengiriman laporan palsu massal.
3. **Formulir Insiden Pasien**: Memastikan integritas data insiden keselamatan pasien (IKP) yang dikirim ke Komite Mutu.
4. **Formulir Insiden Karyawan**: Mengamankan pencatatan insiden K3 (kecelakaan kerja, paparan B3, paparan infeksius, PAK).
5. **Formulir Budaya Keselamatan**: Mengamankan pencatatan keluhan budaya keselamatan kerja.

---

## 🚀 Fitur Utama & Modul Sistem

- **Whistleblowing System (WBS - Akses Publik)**: Pelaporan pelanggaran berat/etik secara anonim dengan estimasi kerugian finansial dan pengunggahan berkas bukti (Base64).
- **Patient Incident (Insiden Pasien - IKP)**: Integrasi pencarian data rekam medis pasien terdaftar di SIMRS atau opsi non-pasien, serta kalkulasi otomatis **Risk Grading Matrix** (Dampak Klinis × Probabilitas Frekuensi) dengan penentuan rekomendasi investigasi (Sederhana vs RCA).
- **Employee Incident (Insiden Karyawan - K3RS)**: Mendukung staf internal dan tenaga alih daya (*outsourcing*) dengan 4 kategori insiden spesifik:
  - Tipe 01: Kecelakaan Kerja (*Work Accident*)
  - Tipe 02: Paparan Bahan Berbahaya & Beracun (*B3 Exposure*)
  - Tipe 03: Paparan Infeksius / Tertusuk Jarum Suntik (*Infectious Exposure*) dengan ceklis tata laksana awal
  - Tipe 04: Penyakit Akibat Kerja (*PAK / PAHK*)
- **Non-Conformity Safety Culture (NCSF)**: Pencatatan pelanggaran standar budaya keselamatan dengan kemampuan mengelola banyak pegawai terlapor (*multi-subject*) sekaligus.
- **Pengunggah Berkas Terpadu (*Evidence Dropzone*)**: Pengunggahan dokumen, gambar, audio, dan video pendukung insiden dengan konversi otomatis ke Base64.
- **Sesi Aman & Terenkripsi**: Penyimpanan sesi login terenkripsi menggunakan algoritma AES (CryptoJS) dengan masa kedaluwarsa 6 hari.

---

## 🛠️ Teknologi (Tech Stack)

- **Frontend**: React 19 (TypeScript), Vite
- **Komponen UI**: Mantine UI v8 (`@mantine/core`, `@mantine/dates`, `@mantine/dropzone`, `@mantine/notifications`, `@mantine/modals`), FontAwesome Icons
- **Manajemen Kueri & State**: TanStack React Query v5
- **Klien HTTP**: Axios (terintegrasi ke SIMRS EHR) & Fetch API (terintegrasi ke server CAPTCHA)
- **Keamanan Sesi**: CryptoJS (AES-256)
- **Manipulasi Tanggal**: Day.js
- **Verifikasi Anti-Bot**: ALTCHA Web Component (`<altcha-widget>`) terintegrasi dengan `captcha-server`

---

## ⚙️ Konfigurasi Variabel Lingkungan (.env)

Buat atau perbarui berkas `.env` pada direktori utama aplikasi:

```env
# ===================================================================
# KONFIGURASI API BACKEND SIMRS EHR (RUMAH SAKIT CHARITAS)
# ===================================================================
VITE_API_BASE_URL=
VITE_API_BASE_URL_MOBILE2=

VITE_API_ACCESS_KEY=
VITE_API_ENC_METHOD=
VITE_API_ACCESSKEY=
VITE_API_ACCESSKEY_WHISTLEBLOWING=
VITE_API_SCI_ACCESSKEY=
VITE_SECRET_KEY=

# ===================================================================
# KONFIGURASI MICROSERVICE CAPTCHA MANDIRI (captcha-server)
# ===================================================================
VITE_CAPTCHA_URL=
VITE_CAPTCHA_VERIFY_URL=
```

---

## 📦 Menjalankan Aplikasi

### 1. Pastikan Layanan captcha-server Telah Aktif
Masuk ke proyek `captcha-server` dan jalankan server verifikasi:
```bash
cd ../captcha-server
npm install
npm run dev
```
*Pastikan server CAPTCHA berjalan pada port `3000` (dapat dipantau di `{base}:{port}/health`).*

### 2. Jalankan Aplikasi Web Pelaporan Insiden
Pada direktori `avicenna-incident-report`:
```bash
npm install
npm run dev
```
Aplikasi akan aktif secara lokal di `http://localhost:5173`.

### 3. Kompilasi Produksi (Build)
```bash
npm run build
npm run preview
```

---

## 📚 Dokumentasi Terkait

- 📖 **[MANUAL_BOOK.md](file:///Users/mobile-div/Documents/Projects/avicenna-incident-report/MANUAL_BOOK.md)**: Panduan lengkap operasional bagi pengguna dan staf rumah sakit.
- 📋 **[JUKNIS.md](file:///Users/mobile-div/Documents/Projects/avicenna-incident-report/JUKNIS.md)**: Petunjuk teknis mendalam arsitektur sistem dan implementasi verifikasi CAPTCHA ALTCHA.
