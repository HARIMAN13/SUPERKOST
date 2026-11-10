import { Snowflake, Droplets, Zap, Phone, MapPin } from "lucide-react"
import type { TicketCategory } from "./data"

export const VENDORS = [
  {
    name: "CV Sejuk Abadi",
    role: "Spesialis Servis AC",
    icon: Snowflake,
    rating: 4.9,
    jobs: 42,
    phone: "0812-3344-5566",
    contact: { label: "Pak Joko", value: "0812-3344-5566", icon: Phone },
    action: "wa" as const,
    tags: ["Cuci AC", "Isi Freon", "Bongkar Pasang"],
    categories: ["AC"] as TicketCategory[],
  },
  {
    name: "Pak Slamet",
    role: "Tukang Ledeng & Pompa Air",
    icon: Droplets,
    rating: 4.8,
    jobs: 18,
    phone: "0856-7788-9900",
    contact: { label: "Kontak", value: "0856-7788-9900", icon: Phone },
    action: "wa" as const,
    tags: ["Pompa Air", "Pipa Bocor", "Toren"],
    categories: [
      "Pompa Air & Ledeng",
      "Bangunan & Lainnya",
    ] as TicketCategory[],
  },
  {
    name: "Toko Listrik Terang Jaya",
    role: "Suplai Kelistrikan",
    icon: Zap,
    rating: 4.7,
    jobs: 25,
    phone: "031-5994-4242",
    contact: { label: "Alamat", value: "Jl. Dharmawangsa 42", icon: MapPin },
    action: "catalog" as const,
    tags: ["Lampu", "MCB", "Kabel"],
    categories: ["Listrik"] as TicketCategory[],
  },
]

export const CATALOG = [
  ["Lampu LED Philips 12W", "pcs", 38_000],
  ["MCB Schneider 6A", "pcs", 65_000],
  ["Kabel NYM 2x1.5 mm (50 m)", "roll", 485_000],
  ["Stop Kontak Broco 3 Lubang", "pcs", 32_000],
  ["Fitting Lampu Plafon", "pcs", 12_000],
  ["Token Listrik Prabayar 500 kWh", "voucher", 760_000],
] as const

export const JOBS: Record<TicketCategory, string[]> = {
  AC: [
    "Cuci AC Rutin (Preventif)",
    "Isi Ulang Freon",
    "Perbaikan AC Bocor / Netes",
    "Ganti Kapasitor",
  ],
  "Pompa Air & Ledeng": [
    "Perbaikan Pompa Air",
    "Pipa Bocor",
    "Kuras Toren",
    "Kloset / Kran Rusak",
  ],
  Listrik: ["Ganti Lampu / Fitting", "MCB Sering Turun", "Stop Kontak Rusak"],
  "Bangunan & Lainnya": [
    "Kunci / Pintu Rusak",
    "Atap Bocor",
    "Cat Ulang Dinding",
    "Lainnya",
  ],
}
export const DEFAULT_COST: Record<TicketCategory, number> = {
  AC: 150_000,
  "Pompa Air & Ledeng": 250_000,
  Listrik: 100_000,
  "Bangunan & Lainnya": 200_000,
}
