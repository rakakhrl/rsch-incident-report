# PANDUAN DEPLOYMENT
# SISTEM PELAPORAN INSIDEN RUMAH SAKIT (AVICENNA INCIDENT REPORT)

Dokumen ini merupakan panduan teknis untuk tim TI dalam menerapkan aplikasi **Avicenna Incident Report** ke lingkungan produksi, baik melalui **Docker** maupun **Microsoft IIS**.

> [!NOTE]
> Aplikasi ini adalah *Single Page Application* (SPA) berbasis React + Vite. Hasil kompilasi berada di direktori `dist/` dan disajikan sebagai berkas statis. Tidak ada *application server* Node.js di dalam aplikasi ini.

---

## DAFTAR ISI

1. [Prasyarat](#1-prasyarat)
2. [Deployment melalui Docker](#2-deployment-melalui-docker)
3. [Deployment melalui Microsoft IIS](#3-deployment-melalui-microsoft-iis)
4. [Konfigurasi Port (Default 3000)](#4-konfigurasi-port-default-3000)
5. [Referensi Berkas `.env` / `.env.example`](#5-referensi-berkas-env--env-example)
6. [Pemantauan & Health Check](#6-pemantauan--health-check)
7. [Troubleshooting](#7-troubleshooting)
8. [Dokumentasi Terkait](#8-dokumentasi-terkait)

---

## 1. Prasyarat

### Untuk Docker
- Docker Engine dan Docker Compose terinstal pada host.
- Berkas `.env` telah disiapkan (salinan dari `.env.example` dengan nilai yang diisi).

### Untuk Microsoft IIS
- Windows Server 2019 / 2022 dengan IIS 10.0+.
- Modul ekstensi IIS:
  - **URL Rewrite 2.1** (penanganan rute SPA & reverse proxy).
  - **Application Request Routing (ARR) 3.0** (jika digunakan sebagai reverse proxy).
- Runtime mikrolayanan `captcha-server`: Node.js v20.x atau v22.x LTS.
- Node.js LTS untuk kompilasi frontend (`npm run build`).

---

## 2. Deployment melalui Docker

### Langkah-langkah

**1. Siapkan berkas variabel lingkungan**

Salin template `.env.example` menjadi `.env`, lalu isi semua nilai `VITE_*` sesuai infrastruktur rumah sakit:

```bash
cp .env.example .env
# Edit .env dan isi nilai VITE_API_BASE_URL, VITE_CAPTCHA_URL, dll.
```

**2. Bangun dan jalankan kontainer**

```bash
docker compose up -d --build
```

Aplikasi akan tersedia pada `http://localhost:3000` (atau port lain sesuai `PORT` di `.env`).

**3. Menghentikan aplikasi**

```bash
docker compose down
```

### Catatan mikrolayanan captcha-server

`captcha-server` adalah mikrolayanan terpisah yang berada di luar repositori ini dan harus aktif sebelum aplikasi digunakan (untuk verifikasi ALTCHA CAPTCHA). Pastikan `VITE_CAPTCHA_URL` dan `VITE_CAPTCHA_VERIFY_URL` di `.env` menunjuk ke alamat `captcha-server` yang benar.

Jika ingin menjalankan `captcha-server` dalam satu kompose, uncomment blok `captcha-server` di `docker-compose.yml` dan sesuaikan jalur volume serta berkas `.env-nya.

---

## 3. Deployment melalui Microsoft IIS

### Langkah-langkah

**1. Kompilasi frontend**

Pada direktori aplikasi, jalankan:

```bash
npm install
npm run build
```

Hasil kompilasi berada di direktori `dist/`.

**2. Siapkan folder situs IIS**

Buat folder tujuan di server IIS, misalnya `C:\inetpub\wwwroot\avicenna-incident-report`, lalu salin seluruh isi direktori `dist/` ke dalam folder tersebut.

**3. Salin berkas `web.config`**

Salin berkas `web.config` (yang sudah disediakan di repositori ini) ke dalam folder root situs IIS (sama tempat berkas `index.html` hasil build). Berkas ini mengatur:
- **SPA Fallback Routing**: setiap permintaan yang bukan berkas/fisik direktori dan bukan di bawah `/api` atau `/altcha` akan di-rewrite ke `/` (mencegah error 404 saat pengguna me-refresh halaman di ponsel).
- **MIME type `.webp`**: mendukung berkas gambar WebP yang dihasilkan build.

**4. Konfigurasi binding situs di IIS**

Buka **IIS Manager**, buat situs baru (atau edit situs existing), lalu:
- Tetapkan **port binding** ke `3000` (atau port lain sesuai kebutuhan).
- Tetapkan nama host / IP sesuai jaringan rumah sakit.
- Aktifkan **HTTPS** (SSL/TLS) jika situs diakses dari zona publik/DMZ.

**5. Daftarkan `captcha-server` sebagai Layanan Windows**

`captcha-server` harus berjalan sebagai layanan di balik IIS (lihat `JUKNIS.md` §8.4). Contoh menggunakan NSSM:

```cmd
nssm install CaptchaServerService "C:\Program Files\nodejs\node.exe" "D:\Services\captcha-server\dist\index.js"
nssm set CaptchaServerService AppDirectory "D:\Services\captcha-server"
nssm set CaptchaServerService Start SERVICE_AUTO_START
nssm start CaptchaServerService
```

Pastikan `VITE_CAPTCHA_URL` dan `VITE_CAPTCHA_VERIFY_URL` di berkas `.env` aplikasi menunjuk ke alamat `captcha-server` (biasanya `http://localhost:3000/challenge` dan `/verify` pada server IIS yang sama).

---

## 4. Konfigurasi Port (Default 3000)

Port default aplikasi adalah **3000**, dan dapat diubah sesuai kebutuhan penyebaran:

### Docker
Port dikontrol melalui variabel `PORT` di berkas `.env`:

```env
PORT=3000
```

Ubah nilai `PORT`, lalu bangun ulang kontainer:

```bash
docker compose up -d --build
```

Host-port dan container-port akan di-mapping sesuai `${PORT:-3000}`.

### Microsoft IIS
Port diatur melalui **IIS Manager** > **Situs** > **Edit Bindings** > tambahkan/ubah binding HTTP pada port `3000` (atau port lain). Port pada IIS **tidak** dikontrol oleh berkas `.env` — ini merupakan pengaturan administrasi IIS.

---

## 5. Referensi Berkas `.env` / `.env.example`

Berkas `.env.example` disediakan sebagai template. Salin menjadi `.env` dan isi semua nilai:

| Variabel | Keterangan | Contoh |
|---|---|---|
| `PORT` | Port listen aplikasi (Docker) | `3000` |
| `VITE_API_BASE_URL` | URL API SIMRS EHR Incident Report | `http://192.168.3.254/RSCH/Api/IncidentReport` |
| `VITE_API_BASE_URL_MOBILE2` | URL WebService Mobile2 | `http://192.168.3.254/RSCH/live/WebService/MobileWS2.asmx` |
| `VITE_API_ACCESS_KEY` | Access key API | `abcd1234` |
| `VITE_API_ENC_METHOD` | Metode enkripsi | `des` |
| `VITE_API_ACCESSKEY` | Access key utama | `sciadmin88` |
| `VITE_API_ACCESSKEY_WHISTLEBLOWING` | Access key whistleblowing | `anonym` |
| `VITE_API_SCI_ACCESSKEY` | Access key SCI | `sciadmin88` |
| `VITE_SECRET_KEY` | Kunci rahasia sesi | `sci88` |
| `VITE_CAPTCHA_URL` | URL challenge captcha-server | `http://localhost:3000/challenge` |
| `VITE_CAPTCHA_VERIFY_URL` | URL verifikasi captcha-server | `http://localhost:3000/verify` |

Berkas `.env` **tidak di-commit** ke repositori (sudah diatur di `.gitignore`). Setiap environment produksi harus memiliki salinan `.env`-nya sendiri.

---

## 6. Pemantauan & Health Check

### Docker
Health check sudah dikonfigurasi di `docker-compose.yml`:

```bash
docker compose ps
```

Health check memeriksa `http://localhost:${PORT}/` setiap 30 detik.

### IIS / captcha-server
- Buka `GET /health` pada `captcha-server` untuk memantau uptime dan jumlah token anti-replay.
- Log IIS terletak di `C:\inetpub\logs\LogFiles\W3SVC*`.

---

## 7. Troubleshooting

| Gejala | Kemungkinan Penyebab | Solusi |
|---|---|---|
| **HTTP 502.3 Bad Gateway pada CAPTCHA** | `captcha-server` mati atau tidak terjangkau | Restart layanan Windows `CaptchaServerService`; periksa `VITE_CAPTCHA_URL` di `.env` |
| **CORS Policy Error di Browser** | Domain asal belum terdaftar di `CORS_ORIGIN` captcha-server | Periksa berkas `.env` pada `captcha-server`; setel `CORS_ORIGIN=*` untuk pengujian atau cantumkan domain resmi |
| **404 Not Found saat Refresh Halaman** | URL Rewrite IIS tidak aktif atau `web.config` hilang | Pasang modul **IIS URL Rewrite 2.1** dan pastikan `web.config` ada di folder root situs |
| **Sesi Login Logout Sendiri** | Time drift antara server web dan domain controller | Sinkronkan waktu Windows Server dengan NTP rumah sakit |
| **Aplikasi tidak bisa diakses Docker** | Port tidak sesuai atau kontainer gagal start | Periksa `docker compose ps` dan `docker compose logs`; pastikan `PORT` di `.env` sesuai port yang dibuka |
| **Blank screen setelah build** | Variabel `VITE_*` tidak ter-isi saat build | Pastikan `.env` diisi sebelum `docker compose up --build` atau `npm run build` |

---

## 8. Dokumentasi Terkait

- 📖 **[README.md](README.md)**: Gambaran umum aplikasi, referensi `.env`, dan cara menjalankan secara development.
- 📖 **[MANUAL_BOOK.md](MANUAL_BOOK.md)**: Panduan operasional bagi pengguna dan staf rumah sakit.
- 📖 **[JUKNIS.md](JUKNIS.md)**: Dokumentasi teknis & arsitektur untuk tim TI, termasuk panduan IIS dan konfigurasi Windows service untuk `captcha-server` (§8).

---

*Dokumen ini adalah tambahan (additif) dan tidak mengubah isi `README.md`, `MANUAL_BOOK.md`, atau `JUKNIS.md`. Semua dokumen menggunakan bahasa Indonesia.*
