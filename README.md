# SUPERKOST — Sistem Operasi Manajemen Kost Terpadu & Otomasi Tagihan

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Sistem Operasi Back-Office Terintegrasi Berbasis Web untuk Pemilik dan Pengelola Rumah Kost Mandiri (15–160 Kamar)**

[Lihat Fitur](#-fitur-unggulan) • [Cara Instalasi](#-cara-menjalankan-secara-lokal) • [Struktur Proyek](#-struktur-direktori-proyek) • [Arsitektur Mobile](#-arsitektur-responsif-mobile-hp)

</div>

---

## 📌 Ringkasan Proyek

**SUPERKOST** dirancang khusus untuk memecahkan tiga masalah terbesar pengelola kost mandiri:
1. **Spreadsheet Fatigue**: Terlalu banyak file Excel terpisah yang rawan salah rumus dan tercecer.
2. **Keterlambatan Penagihan Sewa**: Rasa sungkan dan repotnya menagih sewa satu per satu via chat manual setiap bulan.
3. **Selisih Uang Jaminan (Deposit)**: Konflik sengketa uang deposit saat penyewa check-out akibat tercampurnya dana deposit dengan kas operasional.

Sistem ini mentransformasi seluruh operasional menjadi satu kesatuan: otomatisasi pengingat tagihan WhatsApp resmi, denah keterisian kamar visual real-time, rekonsiliasi deposit tanpa selisih, dan mode kasir cepat ramah HP bagi staf penjaga kost.

---

## ✨ Fitur Unggulan

### 1. 🌐 Landing Page Publik (`/`)
- **Hero & Live Mockup**: Presentasi nilai solusi dengan animasi indikator status bot real-time.
- **Problem vs Solution**: Komparasi langsung cara lama (manual spreadsheet) vs solusi modern Superkost.
- **Katalog 6 Modul**: Showcase interaktif fitur operasional kost.
- **Kalkulator ROI & Slider Harga**: Simulasi interaktif omzet sewa, waktu yang dihemat, dan paket langganan transparan:
  - **SaaS Bulanan**: Rp149.000 / properti / bulan.
  - **Lisensi Tahunan**: Rp1.490.000 / properti / tahun (*Hemat 2 bulan*).
- **Testimoni & FAQ Accordion**: Tanya jawab seputar kemudahan penggunaan bagi staf gaptek.

### 2. 🔐 Autentikasi & Onboarding (`/login` & `/register`)
- **Halaman Login**:
  - *Role Switcher Tab*: Pilihan instan demo antara **Owner/Manager** (*Muhamad Maulana*) dan **Penjaga Kost/Staf** (*Pak Darto*).
  - Opsi *Remember Me*, *Toggle Show/Hide Password*, dan tombol langsung *Guest Live Demo*.
- **Halaman Pendaftaran Akun**:
  - *Streamlined 2-Step Onboarding*: Langkah 1 (Data Akun Pengelola) dan Langkah 2 (Profil Rumah Kost Pertama + Jumlah Kamar).

### 3. 📊 Master Cockpit (`/app` Dashboard)
- **Metrik Okupansi Real-Time**: Persentase keterisian kamar, jumlah kamar terisi vs kosong, dan visual strip progress.
- **Arus Kas Masuk**: Verifikasi otomatis mutasi sewa bulan berjalan terhadap target.
- **Piutang & Tunggakan**: Peringatan kamar yang menunggak beserta kalkulasi hari.
- **Radar Tagihan WhatsApp (48 Jam)**: Pemantauan jadwal pengiriman tagihan otomatis via Cron Job jam 08:00 WIB.

### 4. 🏢 Visual Denah Kamar Multi-Lantai
- Grid kamar visual Lantai 1, 2, dan 3 dengan filter dinamis.
- Indikator badge warna real-time:
  - 🟢 **Terisi & Lunas**
  - 🔴 **Nunggak** (lengkap dengan jumlah hari)
  - 🟡 **Verifikasi Transfer** (bukti transfer terunggah)
  - ⚪ **Kosong & Siap Huni** (tersedia tombol cepat *+ Check-In*)
- **Room Detail Drawer**: Panel profil 360° penyewa, rincian kontak darurat keluarga, inventaris fasilitas, dan riwayat tagihan.

### 5. 🧾 Tagihan & Verifikasi Bukti Transfer
- **Inspector Bukti Transfer**: Tampilan split-screen foto bukti transfer m-banking (BCA Mobile) berdampingan dengan invoice.
- Tombol 1-klik: **Setujui & Terbitkan Kuitansi Digital** atau **Tolak Bukti (Minta Kirim Ulang via WA)**.
- **Broadcast Tagihan Massal**: Kirim pengingat sewa ke seluruh kamar terpilih secara serentak.
- Ekspor laporan ledger tagihan bulanan format CSV (kompatibel Microsoft Excel).

### 6. 🛡️ Rekonsiliasi Uang Deposit (Deposit Ledger)
- Isolasi dana jaminan dari kas operasional harian.
- Status status deposit: *Terkunci Aman*, *Dalam Sengketa*, dan *Refunded*.
- **Formulir Clearance Check-Out**: Kalkulator otomatis pengurangan biaya kerusakan fasilitas (kunci hilang, cat kotor, dll.), sisa uang di-refund ke rekening penghuni beserta cetak tanda terima PDF resmi.

### 7. 💵 Pembukuan Kas & Laporan Finansial
- Catat beban operasional rutin (Token listrik pompa, PAM, WiFi IndiHome, gaji staf, servis AC).
- Visualisasi grafik arus kas masuk vs keluar 6 bulan.
- Kalkulasi otomatis rasio **Net Profit Margin (%)** dan struktur persentase beban pengeluaran.
- Fitur cetak ringkasan laporan keuangan versi PDF & ekspor CSV.

### 8. ❄️ Servis Preventif Fasilitas & Vendor
- Pemantauan siklus cuci AC berkala (rekomendasi 5 bulan sekali).
- Indikator peringatan unit AC yang mendekati atau melewati batas waktu servis.
- Direktori kontak teknisi langganan (AC, Ledeng, Toko Listrik) yang terintegrasi langsung dengan tautan chat WhatsApp resmi.

### 9. 📱 Mode Kasir Staf & Checklist Harian
- Dirancang khusus untuk staf operasional (Pak Darto) yang mengoperasikan sistem lewat smartphone.
- **3 Tombol Aksi Raksasa**:
  1. *Catat Pembayaran Tunai/Transfer*
  2. *Cek Kamar Kosong Siap Huni*
  3. *Lapor Kerusakan Bangunan/Fasilitas*
- **Checklist Shift Harian**: Monitoring tugas berkala (cek toren air, pel lorong, buang sampah, cek lampu & CCTV, kunci gerbang) + tombol kirim laporan shift ke WhatsApp Owner.

### 10. 💬 Pusat Otomasi WhatsApp Gateway
- Status koneksi gateway online (Fonnte / Wablas API Node).
- Aturan Cron Job aktif (Pengingat H-3, Hari-H, Tunggakan H+1, Kuitansi Lunas Instan).
- Editor template pesan dengan variabel dinamis: `{nama_penghuni}`, `{nomor_kamar}`, `{nominal_tagihan}`, `{tanggal_jatuh_tempo}`, `{rekening_bank}`.
- Pemantauan outbox pesan real-time (Terkirim, Terbaca, Gagal).

---

## 📱 Arsitektur Responsif Mobile (HP)

Aplikasi dirancang secara **Mobile-First**:
- **Mobile Bottom Navigation Bar**: Bilah navigasi melayang 5 tombol jempol (*Beranda, Kamar, Tagihan, Staf, Menu*) di layar HP.
- **Slide-out Mobile Drawer**: Menu navigasi samping lengkap saat tombol hamburger ditekan.
- **Responsive Layout**:
  - Denah kamar otomatis menjadi 2 kolom di layar HP dan 5 kolom di desktop.
  - Tabel tagihan bertransformasi menjadi kartu ringkas vertikal.
  - Dialog pop-up berubah menjadi *Slide-up Bottom Sheet* yang nyaman dioperasikan satu tangan.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Library Antarmuka**: [React 19](https://react.dev/)
- **Bahasa Pemrograman**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling & Desain**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Tipografi**: Inter & Plus Jakarta Sans (Google Fonts)

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat:
- [Node.js](https://nodejs.org/) versi 18.x atau yang lebih baru (disarankan v20+ atau v24).
- npm, pnpm, atau yarn.

### Langkah-langkah:

1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/HARIMAN13/SUPERKOST.git
   cd SUPERKOST
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Development Mode):**
   ```bash
   npm run dev
   ```

4. **Buka di browser:**
   - Landing Page: `http://localhost:3000`
   - Halaman Login: `http://localhost:3000/login`
   - Halaman Register: `http://localhost:3000/register`
   - Cockpit Utama: `http://localhost:3000/app`

5. **Build untuk Produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Struktur Direktori Proyek

```
SUPERKOST/
├── public/                 # Aset grafis statis & favicon
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── app/            # Halaman Dashboard Cockpit Utama (/app)
│   │   ├── login/          # Halaman Autentikasi Masuk (/login)
│   │   ├── register/       # Halaman Pendaftaran Pengelola Baru (/register)
│   │   ├── globals.css     # Tailwind CSS v4, font definitions, & animations
│   │   ├── layout.tsx      # Root Layout & Metadata SEO
│   │   ├── not-found.tsx   # Custom 404 Error Page
│   │   └── page.tsx        # Landing Page Publik (/)
│   ├── components/         # Komponen Antarmuka
│   │   ├── auth/           # Formulir Login & Register
│   │   ├── landing/        # Komponen Landing Page (Hero, Fitur, Pricing, FAQ)
│   │   ├── modals/         # Modal Check-in, Payment, Ticket, Clearance, Dokumen
│   │   ├── navigation/     # Mobile Bottom Nav, Mobile Drawer, Sidebar, Topbar
│   │   ├── pages/          # Modul Dashboard, Rooms, Tenants, Deposits, Finance, Staff
│   │   ├── ui.tsx          # Reusable UI Primitives (Btn, ModalShell, Field, Tabs)
│   │   └── AppShell.tsx    # Responsive Application Shell
│   ├── lib/                # Logika Bisnis & Utilitas
│   │   ├── data.ts         # Data Store, Definisi Entitas, & Mock Generator
│   │   ├── lib.ts          # Generator Ekspor CSV, Terbilang Rupiah, Link WhatsApp
│   │   ├── vendors.ts      # Direktori Teknisi & Katalog Sparepart Listrik/AC
│   │   └── wa.ts           # Simulasi WhatsApp Gateway & Rule Engine
│   └── store/
│       └── store.tsx       # Global State Management (Zustand/Context Pattern)
├── rencana dan plan/       # Arsip PRD Blueprint & Gambar Desain Asli
├── package.json            # Daftar paket & skrip build
├── tsconfig.json           # Konfigurasi TypeScript compiler
└── README.md               # Dokumentasi lengkap proyek
```

---

## 👨‍💻 Kontributor

- **HARIMAN13** — *Pengembang & Perancang Sistem Superkost*
- Dibuat untuk proyek mata kuliah **Desain Thinking**

---

<div align="center">
  <sub>Dibuat dengan ❤️ untuk kemudahan pengelolaan bisnis kost di Indonesia.</sub>
</div>
