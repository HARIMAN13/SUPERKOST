"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  MessageSquare,
  Check,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background radial gradient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 size-[600px] lg:size-[900px] rounded-full bg-gradient-to-tr from-indigo-500/15 to-violet-500/20 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/90 px-3.5 py-1.5 shadow-sm text-xs font-semibold text-indigo-950 backdrop-blur-sm animate-fade-in">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Operasi Back-Office Kos Terpadu No. #1</span>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600 font-bold">Siap Produksi</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Kelola Puluhan Kamar Kos{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
              Tanpa Pusing Spreadsheet
            </span>{" "}
            & Tagihan Macet.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Otomatisasi pengingat tagihan via <strong>WhatsApp Gateway</strong>,
            pantau denah keterisian kamar 100% <em>real-time</em>, dan catat
            uang jaminan deposit tanpa pernah ada selisih.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 hover:shadow-indigo-600/35 transition-all active:scale-95"
            >
              Mulai Uji Coba Gratis 14 Hari
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
            >
              <Sparkles className="size-4 text-indigo-600" />
              Buka Live Cockpit Demo
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600" /> Tanpa Kartu Kredit
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600" /> WhatsApp Gateway Resmi
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-emerald-600" /> Mode Staf Ramah HP
            </span>
          </div>
        </div>

        {/* Hero Interactive App Preview */}
        <div className="mt-12 lg:mt-16 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-2 sm:p-4 shadow-2xl shadow-indigo-950/10 backdrop-blur-md">
            {/* Window bar mockup */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-2">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-rose-400" />
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="size-3 rounded-full bg-emerald-400" />
                <span className="ml-3 font-mono text-[11px] text-slate-400">
                  superkost.id/cockpit/mulyorejo-asri
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="inline-flex size-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-semibold text-emerald-700">
                  Bot Aktif 08:00 WIB
                </span>
              </div>
            </div>

            {/* Dashboard Inner Preview */}
            <div className="mt-3 rounded-xl bg-slate-900 p-4 sm:p-6 text-white overflow-hidden relative">
              {/* Cockpit Mini Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Okupansi Real-time
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                    93.3%
                  </p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">
                    28 Kamar Terisi · 2 Kosong
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Arus Kas Masuk (Nov)
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                    Rp36.250.000
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    86% dari target tagihan
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Deposit Terkunci
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-indigo-300 mt-1">
                    Rp28.000.000
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    Dipisahkan dari kas harian
                  </p>
                </div>
                <div className="rounded-lg bg-slate-800/80 border border-slate-700/60 p-3">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Jadwal Servis AC
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-amber-400 mt-1">
                    1 AC Perlu Cuci
                  </p>
                  <p className="text-[10px] text-slate-300 mt-0.5">
                    Kamar 204 (Siklus 5 Bulan)
                  </p>
                </div>
              </div>

              {/* Floor 1 Grid Preview */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300">
                    Visual Denah Kamar Lantai 1 (Simulasi Live)
                  </span>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    Auto-Sync
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { no: "101", name: "Rafi H.", st: "Lunas", c: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" },
                    { no: "102", name: "Aditya A.", st: "Lunas", c: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" },
                    { no: "103", name: "Bagas P.", st: "Lunas", c: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" },
                    { no: "104", name: "Salsabila", st: "Lunas", c: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" },
                    { no: "105", name: "Farril N.", st: "Verifikasi", c: "bg-amber-950/60 border-amber-500/40 text-amber-300" },
                    { no: "110", name: "Kosong", st: "+ Check-In", c: "bg-slate-800/80 border-dashed border-indigo-400/50 text-indigo-300" },
                  ].map((kmr) => (
                    <div
                      key={kmr.no}
                      className={`rounded-lg border p-2 text-center text-xs transition-transform hover:scale-105 ${kmr.c}`}
                    >
                      <p className="font-bold">Kmr {kmr.no}</p>
                      <p className="text-[10px] truncate opacity-80">{kmr.name}</p>
                      <span className="mt-1 inline-block text-[9px] font-semibold uppercase">
                        {kmr.st}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating notification badges with animation */}
              <div className="hidden sm:flex absolute bottom-4 right-4 items-center gap-2 rounded-lg bg-emerald-600/95 px-3 py-2 text-xs font-semibold text-white shadow-xl backdrop-blur-md animate-bounce">
                <MessageSquare className="size-3.5" />
                <span>WA Notifikasi Otomatis H-3 Berhasil Terkirim</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

