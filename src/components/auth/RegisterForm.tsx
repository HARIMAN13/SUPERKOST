"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  Lock,
  DoorOpen,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    propertyName: "",
    city: "Surabaya",
    totalRooms: 30,
    agreed: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.phone || !formData.email || !formData.password) {
        alert("Mohon lengkapi seluruh kolom langkah 1.");
        return;
      }
      setStep(2);
    } else {
      if (!formData.propertyName) {
        alert("Mohon isi nama rumah kos Anda.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push("/app");
      }, 700);
    }
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
            Daftar Akun Pengelola Kos Baru
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Uji coba gratis 14 hari penuh. Akses seluruh modul operasional.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                step >= 1
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Profil Pengelola
            </span>
          </div>
          <span className="w-8 h-0.5 bg-slate-200" />
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 2
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-slate-700">
              Properti Kos
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 sm:rounded-2xl border border-slate-200/80 animate-fade-in">
          <form onSubmit={handleNext} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pemilik / Pengelola
                  </label>
                  <div className="relative">
                    <input
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Contoh: H. Hendra Maulana"
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                    />
                    <User className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp Aktif
                  </label>
                  <div className="relative">
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0812-3456-7890"
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                    />
                    <Phone className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Digunakan untuk menerima notifikasi sistem & laporan harian.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="nama@email.com"
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                    />
                    <Mail className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Buat Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimal 6 karakter"
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                    />
                    <Lock className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    <span>Lanjut ke Data Kos</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Rumah Kost Pertama
                  </label>
                  <div className="relative">
                    <input
                      name="propertyName"
                      type="text"
                      required
                      value={formData.propertyName}
                      onChange={handleChange}
                      placeholder="Contoh: Kost Mulyorejo Asri"
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                    />
                    <Building2 className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kota / Wilayah
                  </label>
                  <div className="relative">
                    <input
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Contoh: Surabaya Timur"
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                    />
                    <MapPin className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Total Kamar
                  </label>
                  <div className="relative">
                    <input
                      name="totalRooms"
                      type="number"
                      min="1"
                      max="200"
                      required
                      value={formData.totalRooms}
                      onChange={handleChange}
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                    />
                    <DoorOpen className="size-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Bisa ditambah atau diubah kapan saja di dashboard.
                  </span>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                      required
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
                    />
                    <span className="text-xs text-slate-600 leading-tight">
                      Saya menyetujui Ketentuan Layanan & Kebijakan Privasi
                      Superkost.
                    </span>
                  </label>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-slate-300 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Menyiapkan Kos...</span>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        <span>Buka Dashboard</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-indigo-600 hover:text-indigo-800"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

