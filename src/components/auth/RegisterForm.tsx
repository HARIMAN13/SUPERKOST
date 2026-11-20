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
} from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back link */}
        <div className="text-center mb-6">
          <Link
            href="/"
            className="text-xs font-semibold text-stone-600 hover:text-[#141413] transition-colors inline-flex items-center gap-1"
          >
            ← Kembali ke Beranda Superkost
          </Link>
        </div>

        {/* Brand */}
        <div className="text-center">
          <div className="inline-flex items-center">
            <span className="font-display text-3xl font-bold tracking-[-0.04em] text-[#141413]">
              SUPERKOST
            </span>
            <span className="ml-1 size-2 rounded-full bg-[#9A7B4F]" />
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-[#141413]">
            Daftar Akun Pengelola Kos Baru
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            Uji coba gratis 14 hari penuh. Akses seluruh modul operasional.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                step >= 1
                  ? "bg-[#141413] text-[#FAF8F5]"
                  : "bg-stone-200 text-stone-600"
              }`}
            >
              1
            </span>
            <span className="text-xs font-semibold text-stone-700">
              Profil Pengelola
            </span>
          </div>
          <span className="w-8 h-0.5 bg-stone-200" />
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                step === 2
                  ? "bg-[#141413] text-[#FAF8F5]"
                  : "bg-stone-200 text-stone-600"
              }`}
            >
              2
            </span>
            <span className="text-xs font-semibold text-stone-700">
              Properti Kos
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-stone-900/5 sm:rounded-2xl border border-stone-200/90 animate-fade-in">
          <form onSubmit={handleNext} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#141413] outline-none placeholder:text-stone-400 focus:border-[#141413] focus:ring-2 focus:ring-[#141413]/10"
                    />
                    <User className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#141413] outline-none placeholder:text-stone-400 focus:border-[#141413] focus:ring-2 focus:ring-[#141413]/10"
                    />
                    <Phone className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Digunakan untuk menerima notifikasi sistem &amp; laporan harian.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#141413] outline-none placeholder:text-stone-400 focus:border-[#141413] focus:ring-2 focus:ring-[#141413]/10"
                    />
                    <Mail className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#141413] outline-none placeholder:text-stone-400 focus:border-[#141413] focus:ring-2 focus:ring-[#141413]/10"
                    />
                    <Lock className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#141413] py-3 text-xs sm:text-sm font-semibold text-[#FAF8F5] shadow-sm hover:bg-stone-800 transition-all"
                  >
                    <span>Lanjut ke Data Kos</span>
                    <ArrowRight className="size-4 text-[#C5A572]" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#141413] outline-none placeholder:text-stone-400 focus:border-[#141413] focus:ring-2 focus:ring-[#141413]/10"
                    />
                    <Building2 className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#141413] outline-none placeholder:text-stone-400 focus:border-[#141413] focus:ring-2 focus:ring-[#141413]/10"
                    />
                    <MapPin className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      className="h-10 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-xs sm:text-sm text-[#141413] outline-none placeholder:text-stone-400 focus:border-[#141413] focus:ring-2 focus:ring-[#141413]/10"
                    />
                    <DoorOpen className="size-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
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
                      className="mt-0.5 rounded border-stone-300 accent-[#141413] size-4"
                    />
                    <span className="text-xs text-stone-600 leading-tight">
                      Saya menyetujui Ketentuan Layanan &amp; Kebijakan Privasi
                      Superkost.
                    </span>
                  </label>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-xl border border-stone-300 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#141413] py-2.5 text-xs sm:text-sm font-semibold text-[#FAF8F5] shadow-sm hover:bg-stone-800 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>Menyiapkan Kos...</span>
                    ) : (
                      <>
                        <span>Buka Dashboard</span>
                        <ArrowRight className="size-4 text-[#C5A572]" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-500">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-[#8C6D3F] hover:text-[#141413]"
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
