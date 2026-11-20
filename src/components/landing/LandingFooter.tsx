"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#423020] text-stone-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center">
              <span className="font-display text-2xl font-bold tracking-[-0.04em] text-[#FAF8F5]">
                SUPERKOST
              </span>
              <span className="ml-1 size-1.5 rounded-full bg-[#C5A572]" />
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed">
              Sistem manajemen operasional dan pembukuan terpadu untuk pemilik
              serta pengelola rumah kos mandiri. Mengotomatisasi penagihan sewa,
              pemantauan denah kamar real-time, rekonsiliasi deposit, dan laporan
              arus kas.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-500">
              <span className="text-[#C5A572] font-medium">WhatsApp Gateway Resmi</span>
              <span>·</span>
              <span>Surabaya, Indonesia</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FAF8F5]">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-stone-400">
              <li>
                <a href="#fitur" className="hover:text-[#FAF8F5] transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#solusi" className="hover:text-[#FAF8F5] transition-colors">
                  Transformasi Operasional
                </a>
              </li>
              <li>
                <a href="#kalkulator" className="hover:text-[#FAF8F5] transition-colors">
                  Kalkulator Efisiensi
                </a>
              </li>
              <li>
                <a href="#harga" className="hover:text-[#FAF8F5] transition-colors">
                  Lisensi &amp; Harga
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#FAF8F5] transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FAF8F5]">
              Akses Sistem
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/login" className="hover:text-[#FAF8F5] transition-colors">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#FAF8F5] transition-colors">
                  Registrasi Properti Baru
                </Link>
              </li>
              <li>
                <Link
                  href="/app"
                  className="text-[#C5A572] font-semibold hover:text-[#D8B884] transition-colors"
                >
                  Buka Live Demo Cockpit →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 SUPERKOST Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
          <p>Tata Kelola Properti Kos Modern</p>
        </div>
      </div>
    </footer>
  );
}
