"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-baseline">
              <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                SUPERKOST
              </span>
              <span className="ml-1 size-2 rounded-full bg-indigo-500" />
              <span className="ml-3 rounded-md bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                v1.0 Enterprise
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Sistem operasi back-office terpadu untuk pemilik dan pengelola rumah
              kost mandiri. Mengotomatisasi penagihan sewa, denah kamar visual
              real-time, rekonsiliasi deposit, dan pembukuan kas operasional.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="size-4 text-emerald-400" /> WA Bot Engine
              </span>
              <span>•</span>
              <span>Surabaya, Indonesia</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi Cepat
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li>
                <a href="#fitur" className="hover:text-white transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#solusi" className="hover:text-white transition-colors">
                  Solusi Masalah Kos
                </a>
              </li>
              <li>
                <a href="#kalkulator" className="hover:text-white transition-colors">
                  Kalkulator ROI
                </a>
              </li>
              <li>
                <a href="#harga" className="hover:text-white transition-colors">
                  Paket Langganan
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Akses Aplikasi
            </h4>
            <ul className="mt-4 space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Daftar Akun Baru
                </Link>
              </li>
              <li>
                <Link
                  href="/app"
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                >
                  Buka Live Demo Cockpit →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SUPERKOST Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="flex items-center gap-1">
            Dibuat untuk efisiensi bisnis kos di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

