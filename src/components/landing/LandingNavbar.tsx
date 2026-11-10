"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-baseline">
            <span className="font-display text-xl font-extrabold tracking-tight text-[#1E1B4B] group-hover:text-indigo-600 transition-colors">
              SUPERKOST
            </span>
            <span className="ml-1 size-2 rounded-full bg-indigo-600 animate-pulse" />
          </div>
          <span className="hidden sm:inline-flex rounded-full border border-indigo-100 bg-indigo-50/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
            SaaS Kost OS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-slate-600">
          <a href="#fitur" className="hover:text-indigo-600 transition-colors">
            Fitur Unggulan
          </a>
          <a href="#solusi" className="hover:text-indigo-600 transition-colors">
            Solusi
          </a>
          <a href="#kalkulator" className="hover:text-indigo-600 transition-colors">
            Kalkulator ROI
          </a>
          <a href="#harga" className="hover:text-indigo-600 transition-colors">
            Paket Harga
          </a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow transition-all active:scale-95"
          >
            Daftar Gratis
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-[12.5px] font-semibold text-indigo-700 hover:bg-indigo-100/70 transition-colors"
          >
            <Sparkles className="size-3.5 text-indigo-500" />
            Live Demo
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/app"
            className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700"
          >
            Demo
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 animate-slide-down shadow-xl">
          <nav className="flex flex-col space-y-2 pt-2 text-[14px] font-medium text-slate-700">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded-md hover:bg-slate-50"
            >
              Fitur Unggulan
            </a>
            <a
              href="#solusi"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded-md hover:bg-slate-50"
            >
              Solusi Masalah Kos
            </a>
            <a
              href="#kalkulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded-md hover:bg-slate-50"
            >
              Kalkulator Keuntungan
            </a>
            <a
              href="#harga"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded-md hover:bg-slate-50"
            >
              Paket Harga
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-2 rounded-md hover:bg-slate-50"
            >
              Tanya Jawab (FAQ)
            </a>
          </nav>
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Masuk ke Akun
            </Link>
            <Link
              href="/register"
              className="w-full text-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Daftar Gratis 14 Hari
            </Link>
            <Link
              href="/app"
              className="w-full text-center rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white"
            >
              Coba Live Demo (Tanpa Login)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

