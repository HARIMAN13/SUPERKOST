"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Calculator } from "lucide-react";
import { rupiah } from "@/lib/data";

export default function PricingCalculator() {
  const [rooms, setRooms] = useState(30);
  const [avgRent, setAvgRent] = useState(1500000);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const monthlyTurnover = rooms * avgRent;
  const potentialLatePayment = monthlyTurnover * 0.15; // 15% nunggak tanpa bot
  const timeSavedHours = Math.round(rooms * 0.7); // ~20 jam per bulan

  return (
    <section id="kalkulator" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Kalkulator ROI & Paket Harga
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Investasi Terjangkau dengan Pengembalian Instan
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Biaya langganan Superkost setara dengan kurang dari 10% uang sewa satu
            kamar kost per bulan!
          </p>
        </div>

        {/* Interactive ROI Calculator Card */}
        <div className="mt-12 mx-auto max-w-4xl rounded-2xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="size-5 text-indigo-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Kalkulator Estimasi Penghematan Kost Anda
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Jumlah Kamar:</span>
                  <span className="text-indigo-600 font-bold text-sm">
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
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5 Kamar</span>
                  <span>80 Kamar</span>
                  <span>160 Kamar</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                  <span>Rata-rata Tarif Sewa / Kamar:</span>
                  <span className="text-indigo-600 font-bold text-sm">
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
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Rp500rb</span>
                  <span>Rp2 Jt</span>
                  <span>Rp3.5 Jt</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-indigo-50/70 border border-indigo-100 p-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Estimasi Omzet Sewa Bulanan:
                </p>
                <p className="font-display text-2xl font-extrabold text-slate-900">
                  {rupiah(monthlyTurnover)}
                </p>
              </div>

              <div className="border-t border-indigo-200/60 pt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Potensi tunggakan dicegah bot:
                  </span>
                  <span className="font-bold text-emerald-600">
                    ~{rupiah(potentialLatePayment)} / bln
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Waktu admin yang dihemat:
                  </span>
                  <span className="font-bold text-indigo-700">
                    ~{timeSavedHours} Jam / bln
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Section */}
        <div id="harga" className="mt-16 text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex rounded-xl bg-slate-200/80 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Langganan Bulanan
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Tahunan (Hemat 2 Bulan)</span>
              <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-bold text-slate-900">
                PROMO
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Paket Bulanan */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paket Fleksibel
            </p>
            <h4 className="font-display text-2xl font-bold text-slate-900 mt-1">
              SaaS Bulanan
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Bayar per bulan, bebas batal kapan saja.
            </p>

            <div className="mt-6 flex items-baseline">
              <span className="font-display text-4xl font-extrabold text-slate-900">
                Rp149.000
              </span>
              <span className="ml-1.5 text-xs text-slate-500 font-medium">
                / properti / bulan
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
              {[
                "Kapasitas hingga 160 kamar per properti",
                "WhatsApp Gateway resmi (2.000 kuota/bln)",
                "Visual Denah Kamar multi-lantai",
                "Deposit Ledger & verifikasi mutasi",
                "Mode Kasir Staf ramah HP",
                "Ekspor laporan CSV & PDF",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="mt-8 block w-full rounded-xl border border-slate-300 py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Pilih Paket Bulanan
            </Link>
          </div>

          {/* Paket Tahunan */}
          <div className="rounded-2xl border-2 border-indigo-600 bg-white p-6 sm:p-8 shadow-xl relative">
            <div className="absolute -top-3.5 right-6 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow">
              Pilihan Paling Hemat
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Lisensi Tahunan
            </p>
            <h4 className="font-display text-2xl font-bold text-slate-900 mt-1">
              Lisensi 1 Tahun Penuh
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Cukup bayar 10 bulan untuk penggunaan 12 bulan penuh.
            </p>

            <div className="mt-6 flex items-baseline">
              <span className="font-display text-4xl font-extrabold text-indigo-600">
                Rp1.490.000
              </span>
              <span className="ml-1.5 text-xs text-slate-500 font-medium">
                / properti / tahun
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-6">
              {[
                "Semua fitur di paket bulanan tanpa batasan",
                "Hemat Rp298.000 (Gratis 2 bulan langganan)",
                "Bantuan migrasi data spreadsheet awal GRATIS",
                "Prioritas Customer Support via WhatsApp VIP",
                "Jaminan pembaruan fitur v1.0 Enterprise tanpa biaya tambahan",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-indigo-600 shrink-0" />
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="mt-8 block w-full rounded-xl bg-indigo-600 py-3 text-center text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-colors"
            >
              Mulai Lisensi Tahunan (14 Hari Gratis)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

