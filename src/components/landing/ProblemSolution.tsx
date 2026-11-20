"use client";

import { Minus, Check } from "lucide-react";

export default function ProblemSolution() {
  const comparisons = [
    {
      topic: "Penagihan Uang Sewa",
      bad: "Owner atau admin mengirim pesan tagihan manual satu per satu ke penghuni. Rentan terlupa, canggung, dan sering berujung tunggakan berminggu-minggu.",
      good: "Mesin WhatsApp Gateway mengirimkan pengingat H-3, Hari-H, dan notifikasi jatuh tempo otomatis pukul 08:00 WIB lengkap dengan rincian nominal resmi.",
    },
    {
      topic: "Verifikasi Mutasi & Bukti Bayar",
      bad: "Foto bukti transfer menumpuk di galeri ponsel tanpa rekonsiliasi terstruktur. Sulit melacak pembayaran yang belum divalidasi.",
      good: "Panel verifikasi terpusat: tinjau bukti transfer berdampingan dengan tagihan, cocokkan nominal secara akurat, dan terbitkan kuitansi lunas dalam satu klik.",
    },
    {
      topic: "Pengelolaan Uang Deposit",
      bad: "Dana jaminan penghuni tercampur dengan kas operasional harian, memicu selisih perhitungan potongan kerusakan saat penghuni check-out.",
      good: "Buku Besar Deposit Ledger terisolasi dari kas harian. Dilengkapi kalkulator potongan fasilitas dan cetak berita acara pengembalian deposit resmi.",
    },
    {
      topic: "Pemeliharaan AC & Fasilitas",
      bad: "Perawatan baru dilakukan setelah unit AC bocor atau rusak berat, menyebabkan pembengkakan biaya perbaikan darurat.",
      good: "Radar siklus servis preventif berkala setiap 5 bulan per kamar, terintegrasi dengan direktori vendor teknisi langganan.",
    },
    {
      topic: "Operasional Penjaga Kos (Staf)",
      bad: "Penjaga kos kesulitan mengoperasikan perangkat lunak akuntansi yang rumit, sehingga pencatatan kembali menggunakan buku tulis manual.",
      good: "Mode Kasir Staf ramah ponsel: antarmuka ringkas dengan 3 tombol aksi utama serta daftar periksa kebersihan harian tiap shift.",
    },
  ];

  return (
    <section id="solusi" className="py-24 bg-[#F3F0EA] border-b border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F5E53]">
            Transformasi Operasional
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1C2426]">
            Tinggalkan Cara Manual, Beralih ke Sistem Terpadu
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Perbandingan tata kelola rumah kos konvensional dengan standar
            operasional otomatis Superkost.
          </p>
        </div>

        <div className="mt-14 space-y-4 max-w-5xl mx-auto">
          {comparisons.map((item, idx) => (
            <div
              key={item.topic}
              className="rounded-2xl border border-stone-200/90 bg-[#FAF8F5] p-6 sm:p-7 shadow-2xs transition-all hover:border-stone-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-mono text-xs font-semibold text-[#1F5E53] border border-[#C5A572]/40 bg-[#C5A572]/10 px-2.5 py-0.5 rounded">
                  0{idx + 1}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#1C2426]">
                  {item.topic}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cara Lama */}
                <div className="flex items-start gap-3.5 rounded-xl bg-[#ECE8E0]/70 border border-stone-300/60 p-4.5">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-stone-300/80 text-stone-600">
                    <Minus className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      Metode Manual / Spreadsheet
                    </p>
                    <p className="mt-1.5 text-xs sm:text-[13.5px] text-stone-600 leading-relaxed">
                      {item.bad}
                    </p>
                  </div>
                </div>

                {/* Cara Superkost */}
                <div className="flex items-start gap-3.5 rounded-xl bg-white border border-stone-200/90 p-4.5 shadow-2xs">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1F5E53] text-[#C5A572]">
                    <Check className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#1F5E53] uppercase tracking-wider">
                      Standar Eksekutif Superkost
                    </p>
                    <p className="mt-1.5 text-xs sm:text-[13.5px] text-[#1C2426] leading-relaxed">
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
