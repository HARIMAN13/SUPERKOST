"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  UserCheck,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<"owner" | "staff">("owner");
  const [email, setEmail] = useState("maulana@superkost.id");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole: "owner" | "staff") => {
    setRole(newRole);
    if (newRole === "owner") {
      setEmail("maulana@superkost.id");
    } else {
      setEmail("darto.staf@superkost.id");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate authentication delay for smooth UX
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to app cockpit
      router.push("/app");
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back link */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
          >
            ← Kembali ke Beranda Superkost
          </Link>
        </div>

        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-baseline">
            <span className="font-display text-3xl font-extrabold tracking-tight text-[#1E1B4B]">
              SUPERKOST
            </span>
            <span className="ml-1 size-2.5 rounded-full bg-indigo-600 animate-pulse" />
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke Cockpit Properti
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Pusat kendali operasional, tagihan, dan keuangan kos Anda.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 sm:rounded-2xl border border-slate-200/80 animate-fade-in">
          {/* Quick Role Switcher for Demo */}
          <div className="mb-6 rounded-xl bg-slate-100 p-1 flex">
            <button
              type="button"
              onClick={() => handleRoleChange("owner")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                role === "owner"
                  ? "bg-white text-indigo-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Owner / Manajer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("staff")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                role === "staff"
                  ? "bg-white text-indigo-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Penjaga Kost (Staf)
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Email atau No. WhatsApp
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com atau 08123456789"
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 transition-all"
                />
                <Mail className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Kata Sandi
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Petunjuk reset password akan dikirim via WhatsApp nomor terdaftar.");
                  }}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Lupa sandi?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 pr-10 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Lihat password"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
                />
                <span className="text-xs text-slate-600">
                  Ingat perangkat ini selama 30 hari
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Direct Demo Bypass */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <Link
              href="/app"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <UserCheck className="size-3.5 text-indigo-600" />
              <span>Masuk Langsung Sebagai Mode Tamu (Live Demo)</span>
            </Link>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              Belum punya akun kos?{" "}
              <Link
                href="/register"
                className="font-bold text-indigo-600 hover:text-indigo-800"
              >
                Daftar sekarang (Gratis 14 hari)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

