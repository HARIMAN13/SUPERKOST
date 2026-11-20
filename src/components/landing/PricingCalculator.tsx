"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Calculator, ArrowRight } from "lucide-react";
import { rupiah } from "@/lib/data";

export default function PricingCalculator() {
  const [rooms, setRooms] = useState(30);
  const [avgRent, setAvgRent] = useState(1500000);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const monthlyTurnover = rooms * avgRent;
  const potentialLatePayment = monthlyTurnover * 0.15;
  const timeSavedHours = Math.round(rooms * 0.7);

  return (
    <section id="kalkulator" className="py-24 bg-[#F3F0EA] border-b border-stone-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A6543]">
            Valuasi &amp; Lisensi
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2B221E]">
            Investasi Terukur untuk Efisiensi Properti
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Biaya berlangganan Superkost setara dengan kurang dari 10% tarif sewa
            satu kamar per bulan.
          </p>
        </div>

        {/* Interactive ROI Calculator Card */}
        <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-stone-300/80 bg-[#FAF8F5] p-6 sm:p-9 shadow-sm">
          <div className="flex items-center gap-2.5 mb-7 pb-4 border-b border-stone-200">
            <Calculator className="size-5 text-[#8A6543]" />
            <h3 className="font-display text-lg font-bold text-[#2B221E]">
              Simulasi Efisiensi &amp; Arus Kas Properti Anda
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-2.5">
                  <span>Kapasitas Unit Kamar:</span>
                  <span className="text-[#2B221E] font-bold text-sm">
                    {rooms} Kamar
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="160"
                  step="1"
                  value={rooms}
                  onChange={(e) => setRooms(Number(e.target.value))}
                  className="w-full accent-[#8A6543] cursor-pointer h-1.5 bg-stone-300 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-stone-500 mt-1.5">
                  <span>5 Kamar</span>
                  <span>80 Kamar</span>
                  <span>160 Kamar</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-2.5">
                  <span>Rata-Rata Tarif Sewa / Kamar:</span>
                  <span className="text-[#2B221E] font-bold text-sm">
                    {rupiah(avgRent)} / bln
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="3500000"
                  step="100000"
                  value={avgRent}
                  onChange={(e) => setAvgRent(Number(e.target.value))}
                  className="w-full accent-[#8A6543] cursor-pointer h-1.5 bg-stone-300 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-stone-500 mt-1.5">
                  <span>Rp500rb</span>
                  <span>Rp2 Jt</span>
                  <span>Rp3.5 Jt</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#332924] text-[#FAF8F5] p-6 space-y-4 border border-white/10">
              <div>
                <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                  Estimasi Omzet Sewa Bulanan
                </p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#FAF8F5] mt-1">
                  {rupiah(monthlyTurnover)}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">
                    Potensi piutang macet terlindungi:
                  </span>
                  <span className="font-semibold text-[#C5A572]">
                    ~{rupiah(potentialLatePayment)} / bln
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">
                    Efisiensi waktu administrasi:
                  </span>
                  <span className="font-semibold text-stone-200">
                    ~{timeSavedHours} Jam / bln
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Section */}
        <div id="harga" className="mt-16 text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex rounded-xl border border-stone-300/80 bg-[#ECE8E0] p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${billingCycle === "monthly"
                ? "bg-white text-[#2B221E] shadow-2xs"
                : "text-stone-600 hover:text-[#2B221E]"
                }`}
            >
              Lisensi Bulanan
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all flex items-center gap-2 ${billingCycle === "yearly"
                ? "bg-[#8A6543] text-[#FAF8F5] shadow-2xs"
                : "text-stone-600 hover:text-[#2B221E]"
                }`}
            >
              <span>Tahunan</span>
              <span className="text-[10px] font-medium text-[#C5A572]">
                Hemat 2 Bulan
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Paket Bulanan */}
          <div className="rounded-2xl border border-stone-300/90 bg-[#FAF8F5] p-7 sm:p-9 shadow-2xs flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-stone-500">
                Paket Fleksibel
              </p>
              <h4 className="font-display text-2xl font-bold text-[#2B221E] mt-1.5">
                Lisensi Bulanan
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Berlangganan per bulan tanpa komitmen jangka panjang.
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="font-display text-4xl font-bold text-[#2B221E]">
                  Rp149.000
                </span>
                <span className="ml-2 text-xs text-stone-500 font-medium">
                  / properti / bulan
                </span>
              </div>

              <ul className="mt-7 space-y-3.5 text-xs sm:text-[13px] text-stone-700 border-t border-stone-200 pt-6">
                {[
                  "Kapasitas hingga 160 kamar per properti",
                  "WhatsApp Gateway resmi (2.000 kuota pesan/bulan)",
                  "Visual Denah Kamar interaktif multi-lantai",
                  "Buku Besar Deposit Ledger & verifikasi mutasi",
                  "Mode Kasir Staf ramah ponsel",
                  "Ekspor laporan keuangan CSV & PDF",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#8A6543] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 block w-full rounded-xl border border-stone-300 bg-white py-3.5 text-center text-xs font-bold text-[#2B221E] hover:bg-stone-100 transition-colors"
            >
              Pilih Lisensi Bulanan
            </Link>
          </div>

          {/* Paket Tahunan */}
          <div className="rounded-2xl border border-white/10 bg-[#332924] text-[#FAF8F5] p-7 sm:p-9 shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 rounded-full border border-[#D4B483]/40 bg-[#8A6543] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FAF8F5]">
              Rekomendasi Eksekutif
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#C5A572]">
                Lisensi Tahunan
              </p>
              <h4 className="font-display text-2xl font-bold text-white mt-1.5">
                Lisensi 1 Tahun Penuh
              </h4>
              <p className="text-xs text-stone-400 mt-1">
                Biaya 10 bulan untuk penggunaan penuh selama 12 bulan.
              </p>

              <div className="mt-6 flex items-baseline">
                <span className="font-display text-4xl font-bold text-[#C5A572]">
                  Rp1.490.000
                </span>
                <span className="ml-2 text-xs text-stone-400 font-medium">
                  / properti / tahun
                </span>
              </div>

              <ul className="mt-7 space-y-3.5 text-xs sm:text-[13px] text-stone-300 border-t border-stone-800 pt-6">
                {[
                  "Seluruh fitur penuh tanpa batasan modul",
                  "Penghematan langsung Rp298.000 per tahun",
                  "Pendampingan migrasi data awal dari Excel/Spreadsheet",
                  "Layanan bantuan prioritas via jalur khusus WhatsApp",
                  "Pembaruan sistem berkala tanpa biaya tambahan",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="size-4 text-[#C5A572] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C5A572] py-3.5 text-center text-xs font-bold text-[#2B221E] hover:bg-[#D4B685] transition-colors"
            >
              <span>Mulai Lisensi Tahunan (14 Hari Gratis)</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
