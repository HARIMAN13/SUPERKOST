import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUPERKOST — Sistem Operasi Manajemen Kost Modern & Otomasi Tagihan",
  description:
    "Solusi back-office lengkap pemilik kost mandiri: otomasi tagihan WhatsApp, denah kamar visual real-time, rekonsiliasi deposit tanpa selisih, dan pembukuan kas otomatis.",
  keywords: [
    "manajemen kost",
    "aplikasi kost",
    "software kos-kosan",
    "otomasi whatsapp tagihan",
    "superkost",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#FAF8F5] text-[#1C2426] antialiased selection:bg-[#1F5E53] selection:text-[#FAF8F5]">
        {children}
      </body>
    </html>
  );
}
