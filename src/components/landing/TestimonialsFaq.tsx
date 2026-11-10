"use client";

import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";

export default function TestimonialsFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: "H. Hendra Wijaya",
      role: "Pemilik Kost Mulyorejo Asri (30 Kamar)",
      location: "Surabaya",
      text: "Dulu tiap tanggal 1 sampai 10 kepala pusing mencocokkan mutasi rekening dan bukti transfer dari 30 anak kos. Sejak pakai Superkost, verifikasi mutasi cuma tinggal klik setujui, kuitansi langsung meluncur otomatis ke WhatsApp mereka. Hemat waktu luar biasa!",
    },
    {
      name: "Ibu Ratna Susanti",
      role: "Pengelola Mega Kost (160 Kamar)",
      location: "Yogyakarta",
      text: "Yang paling saya suka adalah fitur Deposit Ledger. Dulu tiap kali anak kos wisuda atau pindah selalu ada ribut soal potongan cat atau kunci hilang. Sekarang semua catatan pemotongan transparan dan ada slip resminya.",
    },
    {
      name: "Pak Darto",
      role: "Staf Penjaga Kost",
      location: "Surabaya Timur",
      text: "Saya orangnya gaptek kalau disuruh pakai laptop. Tapi Superkost ada tombol Mode Kasir di HP: cuma 3 tombol gede buat catat bayar, cek kamar kosong, sama lapor kran bocor. Gampang banget dipakainya!",
    },
  ];

  const faqs = [
    {
      q: "Apakah staf penjaga kos yang tidak mengerti komputer bisa memakai aplikasi ini?",
      a: "Tentu bisa! Kami merancang khusus 'Mode Kasir Staf' di tampilan handphone. Tampilannya hanya memiliki 3 tombol aksi besar (Catat Bayar, Cek Kamar Kosong, Lapor Kerusakan) serta checklist shift harian. Sangat sederhana dan tidak membingungkan.",
    },
    {
      q: "Apakah anak kos (penghuni) diwajibkan mendownload aplikasi atau login ke web?",
      a: "Sama sekali tidak perlu! Anak kos menerima tagihan rincian sewa, tanggal jatuh tempo, rekening pembayaran, hingga tanda terima kuitansi lunas secara otomatis melalui pesan WhatsApp resmi.",
    },
    {
      q: "Bagaimana jika saya sudah punya catatan pembukuan di Excel atau spreadsheet?",
      a: "Superkost dirancang untuk mempermudah migrasi data. Tim bantuan teknis kami juga siap membantu Anda memindahkan seluruh daftar kamar dan penghuni dari Excel ke dalam sistem secara gratis untuk pengguna paket tahunan.",
    },
    {
      q: "Apakah sistem mendukung jika saya mengelola lebih dari 1 properti kos?",
      a: "Sangat mendukung! Di bagian atas sistem terdapat fitur Multi-Property Switcher. Anda bisa beralih dari satu rumah kos ke properti lainnya dalam hitungan detik tanpa perlu logout.",
    },
    {
      q: "Bagaimana cara kerja gateway WhatsApp dan jadwal otomatisnya?",
      a: "Sistem menggunakan penjadwalan Cron harian jam 08:00 WIB untuk memindai tagihan yang mendekati jatuh tempo (H-3 dan Hari-H) kemudian mengirimkan template pesan resmi WhatsApp secara otomatis.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Kisah Sukses Pengelola
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Dipercaya Pengelola Kos Mandiri
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Dengarkan langsung dari pemilik kos dan staf lapangan yang terbantu
            oleh Superkost.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60">
                <p className="text-xs font-bold text-slate-900">{t.name}</p>
                <p className="text-[11px] text-slate-500">
                  {t.role} · {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pertanyaan yang Sering Diajukan
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Punya pertanyaan lain? Tim WhatsApp kami siap membantu 24/7.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={f.q}
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`size-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-indigo-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

