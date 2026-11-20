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
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<"owner" | "staff">("owner");
  const [email, setEmail] = useState("maulana@superkost.id");
  const [password, setPassword] = useState("Superkost2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleChange = (newRole: "owner" | "staff") => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === "owner") {
      setEmail("maulana@superkost.id");
      setPassword("Superkost2026!");
    } else {
      setEmail("darto.staf@superkost.id");
      setPassword("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (!supabase) {
      setTimeout(() => {
        setIsLoading(false);
        router.push("/app");
      }, 400);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(
          error.message === "Invalid login credentials"
            ? "Email atau kata sandi tidak cocok. Silakan periksa kembali."
            : error.message
        );
        setIsLoading(false);
        return;
      }

      router.push("/app");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back link */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-[#2B221E] transition-colors inline-flex items-center gap-1"
          >
            ← Kembali ke Beranda Superkost
          </Link>
        </div>

        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center">
            <span className="font-display text-3xl font-bold tracking-[-0.04em] text-[#2B221E]">
              SUPERKOST
            </span>
            <span className="ml-1 size-2 rounded-full bg-[#9A7B4F]" />
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#2B221E]">
            Masuk ke Cockpit Properti
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Pusat kendali operasional, tagihan, dan keuangan kos Anda.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-stone-900/5 sm:rounded-2xl border border-stone-200/90 animate-fade-in">
          {/* Quick Role Switcher for Demo */}
          <div className="mb-6 rounded-xl bg-[#F3F0EA] p-1 flex border border-stone-200/80">
            <button
              type="button"
              onClick={() => handleRoleChange("owner")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                role === "owner"
                  ? "bg-[#8A6543] text-[#FAF8F5] shadow-2xs"
                  : "text-stone-600 hover:text-[#2B221E]"
              }`}
            >
              Owner / Manajer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("staff")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                role === "staff"
                  ? "bg-[#8A6543] text-[#FAF8F5] shadow-2xs"
                  : "text-stone-600 hover:text-[#2B221E]"
              }`}
            >
              Penjaga Kost (Staf)
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
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
                  className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#2B221E] outline-none placeholder:text-stone-400 focus:border-[#8A6543] focus:ring-2 focus:ring-[#8A6543]/15 transition-all"
                />
                <Mail className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-stone-700"
                >
                  Kata Sandi
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Petunjuk reset password akan dikirim via WhatsApp nomor terdaftar.");
                  }}
                  className="text-[11px] font-semibold text-[#8A6543] hover:text-[#2B221E]"
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
                  className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 pr-10 text-xs sm:text-sm text-[#2B221E] outline-none placeholder:text-stone-400 focus:border-[#8A6543] focus:ring-2 focus:ring-[#8A6543]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
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
                  className="rounded border-stone-300 accent-[#8A6543] size-4"
                />
                <span className="text-xs text-stone-600">
                  Ingat perangkat ini selama 30 hari
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#8A6543] py-3 text-xs sm:text-sm font-semibold text-[#FAF8F5] shadow-sm hover:bg-[#735335] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="size-4 text-[#C5A572]" />
                </>
              )}
            </button>
          </form>

          {/* Direct Demo Bypass */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <Link
              href="/app"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] py-2.5 text-xs font-semibold text-[#2B221E] hover:bg-stone-100 transition-colors"
            >
              <UserCheck className="size-3.5 text-[#8A6543]" />
              <span>Masuk Langsung Sebagai Mode Tamu (Live Demo)</span>
            </Link>
          </div>

          <div className="mt-5 text-center">
            <p className="text-xs text-stone-500">
              Belum punya akun kos?{" "}
              <Link
                href="/register"
                className="font-bold text-[#8A6543] hover:text-[#2B221E]"
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
