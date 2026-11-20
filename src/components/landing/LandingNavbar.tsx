"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ArrowUpRight } from "lucide-react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full pt-3 sm:pt-4 px-4 sm:px-6 lg:px-8 pointer-events-none">
      {/* Floating Pill Container */}
      <div className="pointer-events-auto mx-auto flex h-13 sm:h-14 max-w-5xl items-center justify-between rounded-full border border-stone-200/90 bg-white/85 px-4 sm:px-6 shadow-lg shadow-stone-900/[0.04] backdrop-blur-md transition-all">
        {/* Brand */}
        <Link href="/" className="flex items-center pl-1 group shrink-0">
          <span className="font-display text-lg sm:text-[19px] font-bold tracking-[-0.04em] text-[#1C2426]">
            SUPERKOST
          </span>
          <span className="ml-1 size-1.5 rounded-full bg-[#9A7B4F]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 text-[13px] font-medium text-stone-600">
          <a
            href="#fitur"
            className="rounded-full px-3 py-1.5 hover:bg-stone-100/90 hover:text-[#1C2426] transition-colors"
          >
            Fitur Unggulan
          </a>
          <a
            href="#solusi"
            className="rounded-full px-3 py-1.5 hover:bg-stone-100/90 hover:text-[#1C2426] transition-colors"
          >
            Solusi
          </a>
          <a
            href="#kalkulator"
            className="rounded-full px-3 py-1.5 hover:bg-stone-100/90 hover:text-[#1C2426] transition-colors"
          >
            Kalkulator ROI
          </a>
          <a
            href="#harga"
            className="rounded-full px-3 py-1.5 hover:bg-stone-100/90 hover:text-[#1C2426] transition-colors"
          >
            Paket Harga
          </a>
          <a
            href="#faq"
            className="rounded-full px-3 py-1.5 hover:bg-stone-100/90 hover:text-[#1C2426] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-stone-600 hover:text-[#1C2426] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-1 rounded-full border border-stone-300/90 bg-[#FAF8F5] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#1C2426] hover:border-stone-400 hover:bg-stone-100 transition-all"
          >
            Live Demo
            <ArrowUpRight className="size-3.5 text-stone-500" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1F5E53] px-4 py-1.5 text-[12.5px] font-semibold text-[#FAF8F5] shadow-2xs hover:bg-[#184B42] transition-all"
          >
            Daftar Gratis
            <ArrowRight className="size-3.5 text-[#C5A572]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/app"
            className="rounded-full border border-stone-300 bg-[#FAF8F5] px-3 py-1 text-xs font-semibold text-[#1C2426]"
          >
            Demo
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full p-1.5 text-stone-700 hover:bg-stone-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Floating Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mx-auto mt-2 max-w-5xl rounded-2xl border border-stone-200/90 bg-white/95 px-4 pt-2 pb-5 space-y-3 animate-slide-down shadow-xl backdrop-blur-md">
          <nav className="flex flex-col space-y-1 pt-1 text-[13.5px] font-medium text-stone-700">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-stone-100"
            >
              Fitur Unggulan
            </a>
            <a
              href="#solusi"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-stone-100"
            >
              Solusi Masalah Kos
            </a>
            <a
              href="#kalkulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-stone-100"
            >
              Kalkulator Keuntungan
            </a>
            <a
              href="#harga"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-stone-100"
            >
              Paket Harga
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-stone-100"
            >
              Tanya Jawab (FAQ)
            </a>
          </nav>
          <div className="border-t border-stone-200/80 pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center rounded-full border border-stone-300 bg-white py-2 text-xs font-semibold text-[#1C2426] hover:bg-stone-50"
            >
              Masuk ke Akun
            </Link>
            <Link
              href="/register"
              className="w-full text-center rounded-full bg-[#1F5E53] py-2 text-xs font-semibold text-[#FAF8F5]"
            >
              Daftar Gratis 14 Hari
            </Link>
            <Link
              href="/app"
              className="w-full text-center rounded-full border border-[#9A7B4F]/40 bg-[#9A7B4F]/10 py-2 text-xs font-semibold text-[#1F5E53]"
            >
              Buka Live Demo Cockpit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
