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

export default function MobileDrawer() {
  const s = useStore();
  const { page, financeTab, mobileMenuOpen, setMobileMenuOpen } = s;
  const [showPropPicker, setShowPropPicker] = useState(false);

  if (!mobileMenuOpen) return null;

  const items: {
    icon: typeof LayoutDashboard;
    label: string;
    page: Page;
    tab?: FinanceTab;
  }[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard Utama",
      page: "dashboard",
    },
    {
      icon: DoorOpen,
      label: "Denah & Kamar",
      page: "rooms",
    },
    {
      icon: Users,
      label: "Data Penghuni",
      page: "tenants",
    },
    {
      icon: ReceiptText,
      label: "Tagihan & Invoice",
      page: "billing",
    },
    {
      icon: Vault,
      label: "Rekonsiliasi Deposit",
      page: "deposits",
    },
    {
      icon: ArrowLeftRight,
      label: "Arus Kas & Biaya",
      page: "finance",
      tab: "kas",
    },
    {
      icon: FileBarChart,
      label: "Laporan Laba Rugi",
      page: "finance",
      tab: "laba",
    },
    {
      icon: Wrench,
      label: "Servis & Vendor",
      page: "maintenance",
    },
    {
      icon: ClipboardCheck,
      label: "Checklist Staf",
      page: "staff",
    },
    {
      icon: MessageSquareText,
      label: "WhatsApp Gateway",
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
      <div className="relative w-4/5 max-w-[270px] bg-[#332924] text-stone-200 flex flex-col h-full shadow-2xl animate-slide-up z-10">
        {/* Header */}
        <div className="flex h-15 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center">
            <span className="font-display text-lg font-bold tracking-[-0.04em] text-white">
              SUPERKOST
            </span>
            <span className="ml-1 size-1.5 rounded-full bg-[#D4B483]" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-stone-300 hover:bg-white/10"
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
              <Building2 className="size-4 text-[#D4B483] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {s.property.name}
                </p>
                <p className="text-[10px] text-stone-400 truncate">
                  {s.property.area} · {s.rooms.length} Kamar
                </p>
              </div>
            </div>
          </button>

          {showPropPicker && (
            <div className="mt-2 space-y-1 rounded-lg bg-[#28201C] p-1.5 border border-white/10">
              {s.propertySummaries.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    s.switchProperty(p.id);
                    setShowPropPicker(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-md p-1.5 text-left text-xs ${
                    p.id === s.propId
                      ? "bg-[#8A6543] text-[#E5C99B] font-bold"
                      : "text-stone-300 hover:bg-white/10"
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
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-1">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
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
                    ? "bg-gradient-to-r from-[#8A6543] to-[#735335] text-white ring-1 ring-white/15 font-semibold"
                    : "text-stone-300/85 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 ${on ? "text-[#E5C99B]" : "text-stone-400"}`}
                  strokeWidth={1.8}
                />
                <span className="min-w-0 flex-1 truncate">{it.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-white/10 p-3 space-y-1.5 bg-white/[0.02]">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-stone-300 hover:bg-white/5"
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
