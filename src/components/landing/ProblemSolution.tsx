"use client";

import { XCircle, CheckCircle2 } from "lucide-react";

export default function ProblemSolution() {
  const comparisons = [
    {
      topic: "Penagihan Uang Sewa",
      bad: "Owner/admin harus kirim chat tagihan manual satu per satu ke tiap anak kos. Sering lupa, canggung, atau terlewat hingga nunggak berminggu-minggu.",
      good: "Mesin Bot WhatsApp otomatis mengirimkan pengingat H-3, Hari-H, dan peringatan tunggakan jam 08:00 WIB dengan nomor rekening resmi dan nama anak kos.",
    },
    {
      topic: "Verifikasi Mutasi & Bukti Bayar",
      bad: "Foto struk transfer menumpuk di galeri HP. Rawan bukti transfer m-banking editan/palsu karena tidak dicek rekonsiliasi ke rekening bank.",
      good: "Antarmuka verifikasi cerdas: periksa foto bukti langsung berdampingan dengan invoice, auto-match nominal, dan klik 'Setujui Lunas' dalam 1 detik.",
    },
    {
      topic: "Pengelolaan Uang Deposit",
      bad: "Uang jaminan tercampur dengan uang kas harian kos. Saat penghuni keluar, terjadi selisih hitungan biaya kerusakan kamar dan ribut saat pengembalian.",
      good: "Buku Besar Deposit Ledger terisolasi aman. Tersedia formulir clearance instan: kurangi biaya kerusakan, sisanya di-refund dan cetak bukti kuitansi resmi.",
    },
    {
      topic: "Pemeliharaan AC & Fasilitas",
      bad: "Cuci AC baru dilakukan setelah AC bocor atau rusak parah. Biaya perbaikan mendadak membengkak jutaan rupiah.",
      good: "Radar siklus servis preventif berkala (tiap 5 bulan). Menampilkan status AC per kamar serta kontak tukang & toko listrik langganan yang siap di-WA.",
    },
    {
      topic: "Operasional Penjaga Kos (Staf)",
      bad: "Penjaga kos bingung memakai aplikasi akuntansi rumit di komputer, akhirnya laporan harian tetap dicatat di kertas sobekan.",
      good: "Mode Kasir Sederhana ramah HP: hanya 3 tombol besar (Catat Bayar, Cek Kamar Kosong, Lapor Kerusakan) + checklist kebersihan harian shift.",
    },
  ];

  return (
    <section id="solusi" className="py-20 bg-slate-50 border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Komparasi Efisiensi
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Tinggalkan Cara Lama, Beralih ke Superkost
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Lihat bagaimana Superkost mengubah kerepotan operasional sehari-hari
            menjadi proses otomatis yang presisi.
          </p>
        </div>

        <div className="mt-14 space-y-4 max-w-4xl mx-auto">
          {comparisons.map((item, idx) => (
            <div
              key={item.topic}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {idx + 1}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {item.topic}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cara Lama */}
                <div className="flex items-start gap-3 rounded-xl bg-rose-50/70 border border-rose-200/60 p-4">
                  <XCircle className="size-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                      Cara Lama (Manual / Spreadsheet)
                    </p>
                    <p className="mt-1 text-xs sm:text-[13px] text-rose-800/90 leading-relaxed">
                      {item.bad}
                    </p>
                  </div>
                </div>

                {/* Cara Superkost */}
                <div className="flex items-start gap-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 p-4">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Solusi Superkost (Otomatis & Akurat)
                    </p>
                    <p className="mt-1 text-xs sm:text-[13px] text-emerald-900/90 leading-relaxed">
                      {item.good}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

