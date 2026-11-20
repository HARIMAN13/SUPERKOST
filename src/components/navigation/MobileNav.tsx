"use client";

import {
  LayoutDashboard,
  DoorOpen,
  ReceiptText,
  ClipboardCheck,
  Menu,
} from "lucide-react";
import { useStore, type Page } from "@/store/store";

export default function MobileNav() {
  const s = useStore();
  const { page, stats, setMobileMenuOpen } = s;

  const navItems = [
    {
      id: "dashboard" as Page,
      label: "Beranda",
      icon: LayoutDashboard,
    },
    {
      id: "rooms" as Page,
      label: "Kamar",
      icon: DoorOpen,
    },
    {
      id: "billing" as Page,
      label: "Tagihan",
      icon: ReceiptText,
      badge: stats.overdue.length > 0 ? stats.overdue.length : null,
    },
    {
      id: "staff" as Page,
      label: "Staf",
      icon: ClipboardCheck,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141413]/95 backdrop-blur-md border-t border-white/10 px-2 py-1 safe-pb flex justify-around items-center shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              s.navigate(item.id);
              setMobileMenuOpen(false);
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              isActive
                ? "text-[#C5A572] font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <div className="relative">
              <Icon className="size-5" />
              {item.badge && (
                <span className="absolute -top-1 -right-2 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-extrabold text-white animate-pulse">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 leading-none">{item.label}</span>
            {isActive && (
              <span className="absolute bottom-0 size-1 rounded-full bg-[#C5A572]" />
            )}
          </button>
        );
      })}

      {/* Button to open full mobile drawer */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-400 hover:text-white transition-colors"
      >
        <Menu className="size-5" />
        <span className="text-[10px] mt-1 leading-none">Menu</span>
      </button>
    </nav>
  );
}

