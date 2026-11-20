"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, ArrowUpRight } from "lucide-react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-[#FAF8F5]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center group">
          <span className="font-display text-xl font-bold tracking-[-0.04em] text-[#141413]">
            SUPERKOST
          </span>
          <span className="ml-1 size-1.5 rounded-full bg-[#9A7B4F]" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-stone-600">
          <a href="#fitur" className="hover:text-[#141413] transition-colors">
            Fitur Unggulan
          </a>
          <a href="#solusi" className="hover:text-[#141413] transition-colors">
            Solusi
          </a>
          <a href="#kalkulator" className="hover:text-[#141413] transition-colors">
            Kalkulator ROI
          </a>
          <a href="#harga" className="hover:text-[#141413] transition-colors">
            Paket Harga
          </a>
          <a href="#faq" className="hover:text-[#141413] transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-stone-600 hover:text-[#141413] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300/90 bg-white px-4 py-2.5 text-[13px] font-semibold text-[#141413] shadow-2xs hover:border-stone-400 hover:bg-stone-50 transition-all"
          >
            Live Demo
            <ArrowUpRight className="size-3.5 text-stone-500" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#141413] px-4.5 py-2.5 text-[13px] font-semibold text-[#FAF8F5] shadow-sm hover:bg-stone-800 transition-all"
          >
            Daftar Gratis
            <ArrowRight className="size-3.5 text-[#C5A572]" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/app"
            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-[#141413]"
          >
            Demo
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-stone-700 hover:bg-stone-200/50 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF8F5] px-4 pt-2 pb-6 space-y-3 animate-slide-down shadow-xl">
          <nav className="flex flex-col space-y-1.5 pt-2 text-[14px] font-medium text-stone-700">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-stone-200/50"
            >
              Fitur Unggulan
            </a>
            <a
              href="#solusi"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-stone-200/50"
            >
              Solusi Masalah Kos
            </a>
            <a
              href="#kalkulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-stone-200/50"
            >
              Kalkulator Keuntungan
            </a>
            <a
              href="#harga"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-stone-200/50"
            >
              Paket Harga
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg hover:bg-stone-200/50"
            >
              Tanya Jawab (FAQ)
            </a>
          </nav>
          <div className="border-t border-stone-200 pt-4 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full text-center rounded-lg border border-stone-300 bg-white py-2.5 text-sm font-semibold text-[#141413] hover:bg-stone-50"
            >
              Masuk ke Akun
            </Link>
            <Link
              href="/register"
              className="w-full text-center rounded-lg bg-[#141413] py-2.5 text-sm font-semibold text-[#FAF8F5]"
            >
              Daftar Gratis 14 Hari
            </Link>
            <Link
              href="/app"
              className="w-full text-center rounded-lg border border-[#9A7B4F]/40 bg-[#9A7B4F]/10 py-2.5 text-sm font-semibold text-[#6E5634]"
            >
              Buka Live Demo Cockpit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
