"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  DoorOpen,
  MessageSquareCode,
  ShieldCheck,
  TrendingUp,
  Smartphone,
  Check,
  ArrowUpRight,
} from "lucide-react";

export default function FeaturesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: "cockpit",
      icon: LayoutDashboard,
      title: "Master Cockpit",
      short: "Pusat Kendali Real-Time",
      desc: "Satu layar terpadu untuk memantau tingkat hunian kamar, total pendapatan sewa bulan berjalan, piutang tertunggak, dan antrean validasi bukti transfer tanpa berpindah menu.",
      points: [
        "Metrik okupansi kamar otomatis diperbarui secara real-time",
        "Antrean verifikasi bukti transfer m-banking dalam satu klik",
        "Radar pengingat tagihan jatuh tempo dalam 48 jam ke depan",
        "Ringkasan arus kas harian masuk dan keluar yang akurat",
      ],
      badge: "Eksekutif",
    },
    {
      id: "denah",
      icon: DoorOpen,
      title: "Denah Kamar Visual",
      short: "Grid Interaktif Multi-Lantai",
      desc: "Visualisasi denah fisik properti kos Lantai 1, 2, hingga 3. Klik unit kamar untuk meninjau profil penghuni, masa sewa, tanggal jatuh tempo, atau registrasi penghuni baru.",
      points: [
        "Indikator status terstruktur: Lunas, Tertunggak, Verifikasi, dan Tersedia",
        "Klasifikasi tipe kamar reguler maupun VIP secara fleksibel",
        "Proses check-in cepat dilengkapi pengarsipan identitas KTP",
        "Panel profil 360° penghuni terintegrasi riwayat pembayaran",
      ],
      badge: "Operasional",
    },
    {
      id: "wa",
      icon: MessageSquareCode,
      title: "WhatsApp Auto-Billing",
      short: "Otomasi Penagihan Harian",
      desc: "Terhubung langsung dengan WhatsApp Gateway resmi. Pengingat tagihan H-3, penagihan Hari-H, serta tanda terima kuitansi lunas terkirim otomatis setiap pukul 08:00 WIB.",
      points: [
        "Editor templat pesan dengan variabel dinamis {nama}, {kamar}, {nominal}",
        "Log pengiriman real-time untuk memantau status pesan terkirim",
        "Fitur siaran pengumuman properti (pemeliharaan air, listrik, renovasi)",
        "Kapasitas pengiriman hingga 2.000 pesan per bulan tanpa simpan kontak",
      ],
      badge: "Otomasi",
    },
    {
      id: "deposit",
      icon: ShieldCheck,
      title: "Deposit Ledger",
      short: "Buku Besar Uang Jaminan",
      desc: "Memisahkan dana jaminan penghuni dari arus kas operasional kos. Menghilangkan risiko selisih pencatatan maupun sengketa pengembalian deposit saat penghuni check-out.",
      points: [
        "Pencatatan saldo deposit awal sejak registrasi check-in pertama",
        "Kalkulator transparan untuk pemotongan biaya perbaikan fasilitas",
        "Penyelesaian refund satu klik disertai lampiran bukti transfer",
        "Pencetakan dokumen resmi berita acara penyelesaian deposit",
      ],
      badge: "Finansial",
    },
    {
      id: "keuangan",
      icon: TrendingUp,
      title: "Pembukuan & Laba Rugi",
      short: "Laporan Keuangan Otomatis",
      desc: "Seluruh pencatatan beban operasional (listrik, air, internet, gaji staf, pemeliharaan AC) dikalkulasi otomatis ke dalam laporan laba rugi bersih dan tren arus kas 6 bulan.",
      points: [
        "Struktur kategori biaya operasional properti yang terstandarisasi",
        "Visualisasi perbandingan arus kas masuk terhadap beban bulanan",
        "Kalkulasi margin laba bersih (%) secara instan setiap bulan",
        "Ekspor laporan pembukuan ke format CSV (Excel) dan dokumen PDF",
      ],
      badge: "Akuntansi",
    },
    {
      id: "staf",
      icon: Smartphone,
      title: "Mode Kasir Staf",
      short: "Antarmuka Khusus Penjaga Kos",
      desc: "Dirancang khusus dengan tata letak ringkas agar staf lapangan dapat mencatat pembayaran tunai, memeriksa ketersediaan kamar, dan melapor kerusakan langsung dari ponsel.",
      points: [
        "Tiga tombol aksi utama: Catat Bayar, Cek Kamar Kosong, Lapor Kerusakan",
        "Daftar periksa (checklist) kebersihan dan keamanan shift harian",
        "Pengiriman laporan rekapitulasi shift ke WhatsApp pemilik kos",
        "Tata letak ergonomis yang mudah dioperasikan tanpa pelatihan rumit",
      ],
      badge: "Lapangan",
    },
  ];

  const current = features[activeTab];
  const Icon = current.icon;

  return (
    <section id="fitur" className="py-24 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C6D3F]">
            Arsitektur Sistem
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#141413]">
            Enam Modul Inti Pengelolaan Properti
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Dirancang secara spesifik untuk pemilik kos mandiri di Indonesia,
            bekerja selaras dalam satu ekosistem yang elegan.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {features.map((f, i) => {
            const FIcon = f.icon;
            const on = activeTab === i;
            return (
              <button
                key={f.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2.5 rounded-xl px-4.5 py-3 text-xs sm:text-[13px] font-semibold transition-all border ${
                  on
                    ? "bg-[#141413] text-[#FAF8F5] border-[#141413] shadow-sm"
                    : "bg-white text-stone-600 border-stone-200/90 hover:border-stone-300 hover:text-[#141413]"
                }`}
              >
                <FIcon className={`size-4 ${on ? "text-[#C5A572]" : "text-stone-400"}`} />
                <span>{f.title}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Active Card Display */}
        <div className="mt-10 mx-auto max-w-5xl rounded-2xl border border-stone-800 bg-[#141413] text-[#FAF8F5] p-7 sm:p-12 shadow-xl animate-fade-in relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="md:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#C5A572]/30 bg-[#C5A572]/10 px-3 py-1 text-xs font-semibold text-[#D8B884]">
                <Icon className="size-3.5" />
                <span>Modul 0{activeTab + 1}</span>
                <span>·</span>
                <span>{current.badge}</span>
                <span>·</span>
                <span>{current.short}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {current.title}
              </h3>

              <p className="text-sm sm:text-[15px] text-stone-300 leading-relaxed">
                {current.desc}
              </p>

              <div className="pt-2 space-y-3">
                {current.points.map((pt) => (
                  <div key={pt} className="flex items-start gap-3 text-xs sm:text-sm text-stone-200">
                    <div className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#C5A572]/20 text-[#C5A572]">
                      <Check className="size-3" />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full rounded-xl bg-[#1C1C1A] border border-stone-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Simulasi Interaktif
                  </span>
                  <span className="rounded-full border border-emerald-800/60 bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Siap Diuji
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed">
                  Modul <strong>{current.title}</strong> terintegrasi penuh dengan
                  data simulasi properti 30 kamar dan dapat Anda jalankan langsung
                  tanpa registrasi.
                </p>
                <a
                  href="/app"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#FAF8F5] px-4 py-3 text-xs font-bold text-[#141413] hover:bg-stone-200 transition-colors"
                >
                  <span>Eksplorasi {current.title}</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
