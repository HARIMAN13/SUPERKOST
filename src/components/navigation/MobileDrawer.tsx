"use client";

import {
  LayoutDashboard,
  DoorOpen,
  Users,
  ReceiptText,
  Vault,
  ArrowLeftRight,
  FileBarChart,
  Wrench,
  ClipboardCheck,
  MessageSquareText,
  X,
  Building2,
  Check,
  Home,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useStore, type Page, type FinanceTab } from "@/store/store";
import { useState } from "react";

const pill = (text: string, cls: string) => (
  <span
    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums ${cls}`}
  >
    {text}
  </span>
);

export default function MobileDrawer() {
  const s = useStore();
  const { stats, rooms, page, financeTab, mobileMenuOpen, setMobileMenuOpen } = s;
  const [showPropPicker, setShowPropPicker] = useState(false);
  const juta = (n: number) => `Rp${Math.round(n / 1_000_000)} Jt`;

  if (!mobileMenuOpen) return null;

  const items: {
    icon: typeof LayoutDashboard;
    label: string;
    page: Page;
    tab?: FinanceTab;
    meta?: React.ReactNode;
  }[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard Utama",
      page: "dashboard",
    },
    {
      icon: DoorOpen,
      label: "Denah & Manajemen Kamar",
      page: "rooms",
      meta: pill(`${rooms.length} Kamar`, "bg-white/10 text-indigo-100"),
    },
    {
      icon: Users,
      label: "Data Penghuni & Kontrak",
      page: "tenants",
      meta: pill(`${stats.occupied} Aktif`, "bg-white/10 text-indigo-100"),
    },
    {
      icon: ReceiptText,
      label: "Tagihan & Mesin Invoice",
      page: "billing",
      meta: stats.overdue.length
        ? pill(`${stats.overdue.length} Nunggak`, "bg-[#F43F5E] text-white")
        : pill("Lunas", "bg-[#10B981]/20 text-emerald-200"),
    },
    {
      icon: Vault,
      label: "Rekonsiliasi Uang Deposit",
      page: "deposits",
      meta: pill(
        `${juta(stats.depositHeld)} Held`,
        "bg-[#F59E0B]/15 text-[#FCD34D]"
      ),
    },
    {
      icon: ArrowLeftRight,
      label: "Arus Kas & Pengeluaran",
      page: "finance",
      tab: "kas",
      meta: (
        <span className="text-[10px] text-indigo-300/70">
          Listrik · Air · Gaji
        </span>
      ),
    },
    {
      icon: FileBarChart,
      label: "Laporan Laba Bersih",
      page: "finance",
      tab: "laba",
      meta: pill("XLS/PDF", "bg-white/10 text-indigo-100"),
    },
    {
      icon: Wrench,
      label: "Servis Fasilitas & Vendor",
      page: "maintenance",
      meta: stats.acOverdue.length
        ? pill(
            `${stats.acOverdue.length} Servis AC`,
            "bg-[#F59E0B] text-[#1E1B4B]"
          )
        : undefined,
    },
    {
      icon: ClipboardCheck,
      label: "Checklist Kerja Staf Penjaga",
      page: "staff",
      meta: pill(
        `${s.tasks.filter((t) => t.done).length}/${s.tasks.length}`,
        "bg-white/10 text-indigo-100"
      ),
    },
    {
      icon: MessageSquareText,
      label: "Mesin WhatsApp Gateway",
      page: "whatsapp",
    },
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Drawer Body */}
      <div className="relative w-4/5 max-w-[320px] bg-[#1E1B4B] text-indigo-100 flex flex-col h-full shadow-2xl animate-slide-up z-10">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-baseline">
            <span className="font-display text-lg font-extrabold tracking-wider text-white">
              SUPERKOST
            </span>
            <span className="ml-0.5 size-2 rounded-full bg-[#6366F1]" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-indigo-200 hover:bg-white/10"
            aria-label="Tutup menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Property Selector */}
        <div className="p-3 border-b border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setShowPropPicker(!showPropPicker)}
            className="w-full flex items-center justify-between rounded-lg bg-white/5 p-2 text-left hover:bg-white/10"
          >
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {s.property.name}
                </p>
                <p className="text-[10px] text-indigo-300/80 truncate">
                  {s.property.area} · {s.rooms.length} Kamar
                </p>
              </div>
            </div>
          </button>

          {showPropPicker && (
            <div className="mt-2 space-y-1 rounded-lg bg-slate-900/90 p-1.5 border border-white/10">
              {s.propertySummaries.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    s.switchProperty(p.id);
                    setShowPropPicker(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-md p-1.5 text-left text-xs ${
                    p.id === s.propId
                      ? "bg-indigo-600 text-white font-bold"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  {p.id === s.propId && <Check className="size-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-300/60">
            Modul Operasional
          </p>
          {items.map((it) => {
            const Icon = it.icon;
            const on = page === it.page && (!it.tab || it.tab === financeTab);
            return (
              <button
                key={it.label}
                onClick={() => {
                  s.navigate(it.page, it.tab);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                  on
                    ? "bg-[#4F46E5] text-white font-bold"
                    : "text-indigo-200/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.8} />
                <span className="min-w-0 flex-1 truncate">{it.label}</span>
                {it.meta}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-white/10 p-3 space-y-2 bg-white/[0.02]">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-indigo-200 hover:bg-white/5"
          >
            <Home className="size-4" />
            <span>Ke Halaman Depan</span>
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="size-4" />
            <span>Keluar Akun (Logout)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

