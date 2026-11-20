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
        className="fixed inset-0 bg-[#2B211A]/45 backdrop-blur-sm animate-fade-in"
      />

      {/* Drawer Body — Light Warm Sand Stone */}
      <div className="relative w-4/5 max-w-[270px] bg-[#F3EFE8] text-[#2B211A] flex flex-col h-full shadow-2xl border-r border-[#E4DDD0] animate-slide-up z-10">
        {/* Header */}
        <div className="flex h-15 items-center justify-between border-b border-[#E4DDD0] px-4">
          <div className="flex items-center">
            <span className="font-display text-lg font-bold tracking-[-0.04em] text-[#2B211A]">
              SUPERKOST
            </span>
            <span className="ml-1 size-1.5 rounded-full bg-[#8A623E]" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-[#7A6857] hover:bg-[#E7E0D3]"
            aria-label="Tutup menu"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Property Selector */}
        <div className="p-3 border-b border-[#E4DDD0] bg-[#EAE3D7]/45">
          <button
            onClick={() => setShowPropPicker(!showPropPicker)}
            className="w-full flex items-center justify-between rounded-lg bg-white/80 border border-[#DFD5C6] p-2 text-left hover:bg-white"
          >
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-[#5C432C] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#2B211A] truncate">
                  {s.property.name}
                </p>
                <p className="text-[10px] text-[#7A6857] truncate">
                  {s.property.area} · {s.rooms.length} Kamar
                </p>
              </div>
            </div>
          </button>

          {showPropPicker && (
            <div className="mt-2 space-y-1 rounded-lg bg-white p-1.5 border border-[#DFD5C6] shadow-sm">
              {s.propertySummaries.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    s.switchProperty(p.id);
                    setShowPropPicker(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-md p-1.5 text-left text-xs ${
                    p.id === s.propId
                      ? "bg-[#5C432C] text-[#FAF8F5] font-bold"
                      : "text-[#524336] hover:bg-[#F3EFE8]"
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
          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8C7A68]">
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
                    ? "bg-[#5C432C] text-[#FAF8F5] font-semibold shadow-sm"
                    : "text-[#524336] hover:bg-[#E7E0D3]/80 hover:text-[#2B211A]"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 ${on ? "text-[#E6C99B]" : "text-[#8C7A68]"}`}
                  strokeWidth={1.8}
                />
                <span className="min-w-0 flex-1 truncate">{it.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-[#E4DDD0] p-3 space-y-1.5 bg-[#EAE3D7]/35">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#524336] hover:bg-[#E7E0D3]"
          >
            <Home className="size-4 text-[#8C7A68]" />
            <span>Ke Halaman Depan</span>
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-500/10"
          >
            <LogOut className="size-4 text-rose-600" />
            <span>Keluar Akun (Logout)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
