"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-7 pb-16 sm:pt-9 lg:pt-11 lg:pb-24 border-b border-stone-200/80">
      {/* Subtle architectural background grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #E7E4DD 1px, transparent 1px), linear-gradient(to bottom, #E7E4DD 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 30%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Main Headline — Perfectly proportioned for 100% viewport fit */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-bold tracking-[-0.035em] text-[#1C2426] leading-[1.12]">
            Kelola Puluhan Kamar Kos{" "}
            <span className="text-[#1F5E53] underline decoration-[#D4B483]/70 decoration-2 underline-offset-8">
              Tanpa Pusing Spreadsheet
            </span>{" "}
            &amp; Tagihan Macet.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-[17px] text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Otomatisasi pengingat tagihan via{" "}
            <span className="font-semibold text-[#1C2426]">WhatsApp Gateway</span>,
            pantau denah keterisian kamar 100% <em>real-time</em>, dan catat
            uang jaminan deposit secara presisi tanpa pernah ada selisih.
          </p>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#1F5E53] px-6.5 py-3.5 text-sm font-semibold text-[#FAF8F5] shadow-md shadow-stone-900/10 hover:bg-[#184B42] transition-all"
            >
              Mulai Uji Coba Gratis 14 Hari
              <ArrowRight className="size-4 text-[#C5A572]" />
            </Link>
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-6.5 py-3.5 text-sm font-semibold text-[#1C2426] shadow-2xs hover:border-stone-400 hover:bg-stone-50 transition-all"
            >
              Buka Live Cockpit Demo
              <ArrowUpRight className="size-4 text-stone-500" />
            </Link>
          </div>

          {/* Micro trust indicators — Visible above the fold at 100% zoom */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs font-medium text-stone-500">
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-[#1F5E53]" /> Tanpa Kartu Kredit
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-[#1F5E53]" /> WhatsApp Gateway Resmi
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="size-3.5 text-[#1F5E53]" /> Mode Staf Ramah HP
            </span>
          </div>
        </div>

        {/* Hero Interactive App Preview — Bespoke Executive Terminal */}
        <div className="mt-10 lg:mt-12 relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-stone-300/80 bg-[#F2EFE9] p-2.5 sm:p-4 shadow-2xl shadow-stone-900/10">
            {/* Window bar mockup */}
            <div className="flex items-center justify-between border-b border-stone-300/70 pb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-stone-400" />
                <span className="size-2.5 rounded-full bg-stone-400" />
                <span className="size-2.5 rounded-full bg-stone-400" />
                <span className="ml-2 font-mono text-[11px] text-stone-500 tracking-tight">
                  superkost.id/cockpit/mulyorejo-asri
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                <span className="inline-flex size-2 rounded-full bg-emerald-700" />
                <span className="text-[11px] font-semibold text-stone-700">
                  Penjadwalan Otomatis · 08:00 WIB
                </span>
              </div>
            </div>

            {/* Dashboard Inner Preview */}
            <div className="mt-3 rounded-xl bg-[#1C2426] p-5 sm:p-7 text-[#FAF8F5] overflow-hidden relative border border-white/10">
              {/* Cockpit Mini Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="rounded-xl bg-[#242F31] border border-white/[0.08] p-4">
                  <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                    Okupansi Real-Time
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-[#FAF8F5] mt-1.5">
                    93.3%
                  </p>
                  <p className="text-[11px] text-[#D4B483] mt-1">
                    28 Kamar Terisi · 2 Kosong
                  </p>
                </div>
                <div className="rounded-xl bg-[#242F31] border border-white/[0.08] p-4">
                  <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                    Arus Kas Masuk (Nov)
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-[#FAF8F5] mt-1.5">
                    Rp36.250.000
                  </p>
                  <p className="text-[11px] text-emerald-400/90 mt-1">
                    86% dari target tagihan
                  </p>
                </div>
                <div className="rounded-xl bg-[#242F31] border border-white/[0.08] p-4">
                  <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                    Deposit Terkunci
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-[#D4B483] mt-1.5">
                    Rp28.000.000
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Terpisah dari kas harian
                  </p>
                </div>
                <div className="rounded-xl bg-[#242F31] border border-white/[0.08] p-4">
                  <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
                    Pemeliharaan Unit
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold text-stone-200 mt-1.5">
                    1 Unit AC
                  </p>
                  <p className="text-[11px] text-amber-400/90 mt-1">
                    Kamar 204 · Jadwal Servis
                  </p>
                </div>
              </div>

              {/* Floor 1 Grid Preview */}
              <div className="mt-5 pt-4 border-t border-stone-800/90">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-stone-300 tracking-wide">
                    Denah Kamar Lantai 1 — Ikhtisar Operasional
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#C5A572] font-medium">
                    <ShieldCheck className="size-3.5" />
                    Tersinkronisasi
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {[
                    {
                      no: "101",
                      name: "Rafi H.",
                      st: "Lunas",
                      c: "bg-[#1C241E] border-emerald-800/60 text-emerald-300/90",
                    },
                    {
                      no: "102",
                      name: "Aditya A.",
                      st: "Lunas",
                      c: "bg-[#1C241E] border-emerald-800/60 text-emerald-300/90",
                    },
                    {
                      no: "103",
                      name: "Bagas P.",
                      st: "Lunas",
                      c: "bg-[#1C241E] border-emerald-800/60 text-emerald-300/90",
                    },
                    {
                      no: "104",
                      name: "Salsabila",
                      st: "Lunas",
                      c: "bg-[#1C241E] border-emerald-800/60 text-emerald-300/90",
                    },
                    {
                      no: "105",
                      name: "Farril N.",
                      st: "Verifikasi",
                      c: "bg-[#262118] border-[#9A7B4F]/50 text-[#D8B884]",
                    },
                    {
                      no: "110",
                      name: "Tersedia",
                      st: "+ Check-In",
                      c: "bg-[#1C1C1A] border-dashed border-stone-700 text-stone-300",
                    },
                  ].map((kmr) => (
                    <div
                      key={kmr.no}
                      className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${kmr.c}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white">#{kmr.no}</p>
                        <span className="text-[9px] font-semibold uppercase tracking-wider opacity-90">
                          {kmr.st}
                        </span>
                      </div>
                      <p className="text-[11px] truncate opacity-75 mt-1">
                        {kmr.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
