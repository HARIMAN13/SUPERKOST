"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  DoorOpen,
  MessageSquareCode,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  CheckCircle,
} from "lucide-react";

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: "cockpit",
      icon: LayoutDashboard,
      title: "Master Cockpit",
      short: "Pusat Kendali Real-Time",
      desc: "Satu layar terpadu untuk melihat metrik okupansi kamar 100%, total uang sewa masuk bulan ini, piutang tertunggak, dan antrean validasi bukti transfer tanpa perlu membuka menu terpisah.",
      points: [
        "Metrik okupansi kamar otomatis ter-update",
        "Antrean 1-klik verifikasi bukti m-banking",
        "Radar waktu tagihan jatuh tempo dalam 48 jam",
        "Rekap kas harian masuk vs kas keluar",
      ],
      badge: "Eksekutif",
    },
    {
      id: "denah",
      icon: DoorOpen,
      title: "Denah Kamar Visual",
      short: "Grid Interaktif Multi-Lantai",
      desc: "Visualisasi denah fisik kost Lantai 1, 2, hingga 3. Klik kartu kamar untuk melihat data penghuni, kontrak, tanggal jatuh tempo, atau check-in penyewa baru secara instan.",
      points: [
        "Indikator warna: Lunas (Hijau), Nunggak (Merah), Verifikasi (Kuning), Kosong (Biru)",
        "Dukungan kamar VIP dan filter tipe kamar",
        "Check-in cepat dengan formulir upload KTP",
        "Drawer profil 360° penghuni dalam satu klik",
      ],
      badge: "Operasional",
    },
    {
      id: "wa",
      icon: MessageSquareCode,
      title: "WhatsApp Gateway Auto-Billing",
      short: "Otomasi Penagihan Harian",
      desc: "Menghubungkan sistem langsung dengan WhatsApp Gateway resmi (Fonnte/Wablas). Pesan tagihan H-3, peringatan Hari-H, dan kuitansi lunas terkirim otomatis jam 08:00 WIB.",
      points: [
        "Editor template pesan dengan variabel dinamis {nama}, {kamar}, {nominal}",
        "Outbox real-time: status terkirim dan terbaca oleh penghuni",
        "Broadcast pengumuman darurat (mati air, renovasi) massal",
        "Quota besar 2.000 pesan/bulan tanpa repot simpan nomor",
      ],
      badge: "Otomasi",
    },
    {
      id: "deposit",
      icon: ShieldCheck,
      title: "Deposit Ledger Anti-Selisih",
      short: "Buku Besar Uang Jaminan",
      desc: "Memisahkan dana deposit penyewa dari rekening kas operasional kos. Mengeliminasi drama sengketa uang deposit saat anak kos memutuskan untuk pindah atau check-out.",
      points: [
        "Pencatatan nominal deposit awal saat check-in pertama kali",
        "Formulir kalkulator pemotongan biaya kerusakan kamar",
        "Proses clearance 1-klik dengan bukti pengembalian transfer",
        "Cetak dokumen resmi tanda terima penyelesaian deposit",
      ],
      badge: "Finansial",
    },
    {
      id: "keuangan",
      icon: TrendingUp,
      title: "Pembukuan Kas & Laba Rugi",
      short: "Laporan Keuangan Otomatis",
      desc: "Pencatatan pengeluaran rutin kost (token listrik pompa, PAM, wifi, gaji staf, servis AC) yang langsung dikalkulasi menjadi laporan laba rugi bersih dan grafik arus kas 6 bulan.",
      points: [
        "Kategori biaya operasional fleksibel dan terstruktur",
        "Grafik perbandingan Cash Flow Masuk vs Keluar",
        "Perhitungan Profit Margin (%) dan struktur beban",
        "Ekspor laporan ke file Excel (.csv) dan PDF siap cetak",
      ],
      badge: "Akuntansi",
    },
    {
      id: "staf",
      icon: Smartphone,
      title: "Mode Kasir Staf Ramah HP",
      short: "Khusus Penjaga Kost (Pak Darto)",
      desc: "Antarmuka yang dirancang sangat sederhana agar staf lapangan tidak bingung. Memungkinkan penjaga kos mencatat pembayaran tunai dan mengecek checklist harian dari smartphone.",
      points: [
        "3 Tombol Aksi Raksasa: Catat Bayar, Cek Kamar Kosong, Lapor Kerusakan",
        "Checklist kerja shift kebersihan (toren, lorong, sampah, CCTV)",
        "Kirim laporan rekap shift ke WhatsApp Owner dengan 1 sentuhan",
        "Didesain nyaman untuk pengoperasian satu tangan (thumb-friendly)",
      ],
      badge: "Mobile-First",
    },
  ];

  const current = features[activeTab];
  const Icon = current.icon;

  return (
    <section id="fitur" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Arsitektur Terpadu
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            6 Modul Hebat untuk Bisnis Kos Anda
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Dirancang berdasarkan riset mendalam pemilik kos mandiri di Indonesia.
            Bekerja harmonis dalam satu ekosistem.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {features.map((f, i) => {
            const FIcon = f.icon;
            const on = activeTab === i;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                  on
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                <FIcon className={`size-4 ${on ? "text-white" : "text-slate-500"}`} />
                <span>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Active Card Display */}
        <div className="mt-8 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 sm:p-10 shadow-2xl animate-fade-in relative overflow-hidden">
          {/* Background decorative glow */}
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                <Icon className="size-3.5" />
                <span>{current.badge}</span>
                <span>•</span>
                <span>{current.short}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {current.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {current.desc}
              </p>

              <div className="pt-2 space-y-2.5">
                {current.points.map((pt) => (
                  <div key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full rounded-xl bg-slate-800/90 border border-slate-700 p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                  <span className="text-xs font-bold text-indigo-400">
                    Status Fitur
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Tersedia & Siap Uji
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Semua modul ini telah disinkronisasikan dan dapat diuji langsung
                  pada panel demonstrasi kami.
                </p>
                <a
                  href="/app"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Buka {current.title} di Cockpit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

