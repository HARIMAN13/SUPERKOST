"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function TestimonialsFaq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const testimonials = [
    {
      name: "H. Hendra Wijaya",
      role: "Pemilik Kost Mulyorejo Asri · 30 Kamar",
      location: "Surabaya",
      text: "Dulu setiap tanggal 1 sampai 10 selalu menyita waktu untuk mencocokkan mutasi rekening dan bukti transfer dari 30 penghuni. Sejak beralih ke Superkost, verifikasi mutasi cukup satu klik dan kuitansi resmi langsung terkirim ke WhatsApp.",
    },
    {
      name: "Ibu Ratna Susanti",
      role: "Pengelola Mega Kost · 160 Kamar",
      location: "Yogyakarta",
      text: "Fitur Deposit Ledger sangat krusial bagi kami. Sebelumnya, setiap kali penghuni selesai masa sewa sering terjadi perdebatan mengenai potongan fasilitas. Sekarang seluruh catatan pemotongan terdokumentasi rapi beserta slip resminya.",
    },
    {
      name: "Pak Darto",
      role: "Koordinator Lapangan & Penjaga Kos",
      location: "Surabaya Timur",
      text: "Saya tidak terbiasa menggunakan komputer. Namun Mode Kasir di ponsel hanya menampilkan tiga tombol utama untuk catat pembayaran, cek kamar kosong, dan lapor kerusakan fasilitas. Sangat praktis dijalankan setiap hari.",
    },
  ];

  const faqs = [
    {
      q: "Apakah staf penjaga kos yang tidak terbiasa dengan komputer dapat mengoperasikan sistem ini?",
      a: "Sangat bisa. Kami menyediakan 'Mode Kasir Staf' khusus untuk tampilan ponsel. Antarmukanya hanya menampilkan 3 tombol aksi utama (Catat Bayar, Cek Kamar Kosong, Lapor Kerusakan) serta daftar periksa kebersihan shift harian yang ringkas.",
    },
    {
      q: "Apakah penghuni kos diwajibkan mengunduh aplikasi atau membuat akun?",
      a: "Tidak perlu. Penghuni kos menerima rincian tagihan sewa, pengingat jatuh tempo, nomor rekening tujuan, hingga kuitansi tanda terima lunas secara otomatis melalui pesan WhatsApp resmi.",
    },
    {
      q: "Bagaimana jika data penghuni saya saat ini masih tersimpan di Excel atau pembukuan manual?",
      a: "Superkost mempermudah proses transisi data. Tim pendamping kami siap membantu memindahkan daftar kamar, tarif, dan data penghuni dari spreadsheet Anda ke dalam sistem tanpa biaya tambahan pada paket tahunan.",
    },
    {
      q: "Apakah satu akun dapat digunakan untuk mengelola lebih dari satu lokasi rumah kos?",
      a: "Ya. Tersedia fitur Multi-Property Switcher di bagian atas dasbor yang memungkinkan Anda berpindah antar cabang properti kos secara instan dalam satu akun pemilik.",
    },
    {
      q: "Bagaimana mekanisme pengiriman pengingat WhatsApp otomatis bekerja?",
      a: "Sistem menjalankan pemindaian terjadwal setiap pukul 08:00 WIB untuk mendeteksi tagihan yang mendekati jatuh tempo (H-3 dan Hari-H), lalu mengirimkan pesan penagihan terpersonalisasi secara otomatis.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Testimonials */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5C432C]">
            Pengalaman Klien
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2B211A]">
            Dipercaya oleh Pemilik &amp; Pengelola Kos
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Catatan nyata dari pemilik properti dan staf operasional yang telah
            menata kelola bisnis kos mereka bersama Superkost.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-stone-200/90 bg-white p-7 shadow-2xs flex flex-col justify-between hover:border-stone-300 transition-colors"
            >
              <div className="space-y-4">
                <span className="font-display text-3xl leading-none text-[#C5A572]">
                  &ldquo;
                </span>
                <p className="text-xs sm:text-[13.5px] text-stone-700 leading-relaxed">
                  {t.text}
                </p>
              </div>

              <div className="mt-7 pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-[#2B211A]">{t.name}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {t.role} · {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center space-y-2.5 mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5C432C]">
              Informasi Lanjutan
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2B211A]">
              Pertanyaan yang Sering Diajukan
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Penjelasan ringkas mengenai implementasi dan operasional harian Superkost.
            </p>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-200">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} className="py-1">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4.5 text-left text-xs sm:text-[14px] font-semibold text-[#2B211A] hover:text-[#5C432C] transition-colors"
                  >
                    <span className="pr-4">{f.q}</span>
                    <ChevronDown
                      className={`size-4 text-stone-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#5C432C]" : ""
                        }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pr-8 text-xs sm:text-[13.5px] text-stone-600 leading-relaxed">
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
