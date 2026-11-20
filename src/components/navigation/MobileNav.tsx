"use client";

import {
  Home,
  DoorOpen,
  ReceiptText,
  ClipboardCheck,
  Menu,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore, type Page } from "@/store/store";

const SLOT_CENTERS = [60, 130, 200, 270, 340];

function buildNotchPath(cx: number): string {
  const nw = 42;
  const nStart = cx - nw;
  const nEnd = cx + nw;
  const tlX = Math.min(32, nStart);
  const trX = Math.max(368, nEnd);

  return [
    `M 32 72`,
    `A 28 28 0 0 1 4 44`,
    `C 4 25, ${tlX - 10} 16, ${tlX} 16`,
    `L ${nStart} 16`,
    `C ${nStart + 16} 16, ${cx - 22} 46, ${cx} 46`,
    `C ${cx + 22} 46, ${nEnd - 16} 16, ${nEnd} 16`,
    `L ${trX} 16`,
    `C ${trX + 10} 16, 396 25, 396 44`,
    `A 28 28 0 0 1 368 72`,
    `L 32 72`,
    `Z`,
  ].join(" ");
}

export default function MobileNav() {
  const s = useStore();
  const { page, stats, mobileMenuOpen, setMobileMenuOpen } = s;

  const navItems = [
    {
      id: "dashboard" as Page,
      label: "Beranda",
      icon: Home,
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

  // Determine which of the 5 slots (0..4) is active
  const pageIdx = navItems.findIndex((item) => item.id === page);
  const targetIdx = mobileMenuOpen ? 4 : pageIdx >= 0 ? pageIdx : 4;
  const targetCx = SLOT_CENTERS[targetIdx] ?? 60;

  const [animCx, setAnimCx] = useState(targetCx);
  const animRef = useRef<number | null>(null);
  const currentCxRef = useRef(targetCx);

  useEffect(() => {
    const startCx = currentCxRef.current;
    const diff = targetCx - startCx;
    if (Math.abs(diff) < 0.5) {
      currentCxRef.current = targetCx;
      setAnimCx(targetCx);
      return;
    }

    const duration = 260;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      // Cubic ease-out for fluid liquid motion
      const eased = 1 - Math.pow(1 - t, 3);
      const next = startCx + diff * eased;
      currentCxRef.current = next;
      setAnimCx(next);
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetCx]);

  const allSlots = [
    ...navItems.map((item, idx) => ({
      key: item.id,
      label: item.label,
      icon: item.icon,
      badge: item.badge,
      isActive: targetIdx === idx,
      onClick: () => {
        s.navigate(item.id);
        setMobileMenuOpen(false);
      },
    })),
    {
      key: "menu",
      label: "Menu",
      icon: Menu,
      badge: null,
      isActive: targetIdx === 4,
      onClick: () => setMobileMenuOpen(!mobileMenuOpen),
    },
  ];

  const ActiveIcon = allSlots[targetIdx]?.icon ?? Home;
  const activeBadge = allSlots[targetIdx]?.badge ?? null;

  return (
    <div className="lg:hidden fixed bottom-2.5 inset-x-0 z-40 px-3 pointer-events-none safe-pb">
      <nav
        aria-label="Navigasi Bawah"
        className="pointer-events-auto relative mx-auto w-full max-w-[380px] aspect-[400/76] select-none"
      >
        {/* SVG Liquid Notch Floating Pill Background */}
        <svg
          viewBox="0 0 400 76"
          className="w-full h-full drop-shadow-[0_14px_28px_rgba(20,20,19,0.38)]"
          fill="none"
        >
          <defs>
            <linearGradient id="navGlassFill" x1="200" y1="16" x2="200" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#262420" stopOpacity="0.94" />
              <stop offset="55%" stopColor="#181715" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#35312B" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="navGlassStroke" x1="200" y1="14" x2="200" y2="73" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.42" />
              <stop offset="45%" stopColor="#C5A572" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.28" />
            </linearGradient>
          </defs>

          <path
            d={buildNotchPath(animCx)}
            fill="url(#navGlassFill)"
            stroke="url(#navGlassStroke)"
            strokeWidth="1.35"
          />

          {/* Subtle bottom home indicator bar */}
          <rect
            x="148"
            y="62"
            width="104"
            height="3.2"
            rx="1.6"
            fill="rgba(255,255,255,0.32)"
          />
        </svg>

        {/* Floating Active Orb inside the Liquid Notch */}
        <button
          type="button"
          onClick={allSlots[targetIdx]?.onClick}
          aria-label={allSlots[targetIdx]?.label}
          style={{
            left: `${(animCx / 400) * 100}%`,
            top: `${(21 / 76) * 100}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex size-[44px] items-center justify-center rounded-full bg-gradient-to-b from-[#33786B] to-[#1D4E44] text-white shadow-[0_6px_18px_rgba(29,78,68,0.55)] ring-1 ring-white/45 transition-transform active:scale-95"
        >
          <div className="relative">
            <ActiveIcon className="size-[21px]" strokeWidth={2.1} />
            {activeBadge && (
              <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#F43F5E] text-[9px] font-extrabold text-white ring-1 ring-white/60">
                {activeBadge}
              </span>
            )}
          </div>
        </button>

        {/* 5 Icon Slots along the Pill Body */}
        {allSlots.map((slot, idx) => {
          const Icon = slot.icon;
          const slotCx = SLOT_CENTERS[idx];
          const isCurrent = idx === targetIdx;
          return (
            <button
              key={slot.key}
              type="button"
              onClick={slot.onClick}
              aria-label={slot.label}
              title={slot.label}
              style={{
                left: `${(slotCx / 400) * 100}%`,
                top: `${(43 / 76) * 100}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full transition-all duration-200 ${
                isCurrent
                  ? "opacity-0 pointer-events-none scale-75"
                  : "opacity-90 hover:opacity-100 text-[#FAF8F5] active:scale-90"
              }`}
            >
              <div className="relative">
                <Icon className="size-[21px]" strokeWidth={1.9} />
                {slot.badge && (
                  <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#F43F5E] text-[9px] font-extrabold text-white">
                    {slot.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
