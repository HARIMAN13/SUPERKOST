"use client";

import {
  Home,
  DoorOpen,
  ReceiptText,
  ClipboardCheck,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useStore, type Page } from "@/store/store";

// 5 evenly spaced slot centers inside the 400x88 SVG coordinate space
const SLOT_CENTERS = [64, 132, 200, 268, 336];

function buildNotchPath(cx: number): string {
  // Pill top is y=22, bottom is y=84 (height=62, corner radius=31).
  // Floating circle is centered at (cx, 18) with radius 20 (diameter 40).
  // Notch cradle is centered at (cx, 18) with bottom at y=47 -> 9px uniform gap around the circle!
  const nw = 44;
  const nStart = cx - nw;
  const nEnd = cx + nw;
  const tlX = Math.min(35, nStart);
  const trX = Math.max(365, nEnd);

  return [
    `M 35 84`,
    `A 31 31 0 0 1 4 53`,
    `C 4 32, ${tlX - 10} 22, ${tlX} 22`,
    `L ${nStart} 22`,
    `C ${nStart + 16} 22, ${cx - 26} 47, ${cx} 47`,
    `C ${cx + 26} 47, ${nEnd - 16} 22, ${nEnd} 22`,
    `L ${trX} 22`,
    `C ${trX + 10} 22, 396 32, 396 53`,
    `A 31 31 0 0 1 365 84`,
    `L 35 84`,
    `Z`,
  ].join(" ");
}

export default function MobileNav() {
  const s = useStore();
  const { page, stats, mobileMenuOpen, setMobileMenuOpen } = s;

  // Ordered with Beranda (Home) right in the CENTER (index 2)
  const navItems: {
    id: Page;
    label: string;
    icon: typeof Home;
    badge?: number | null;
  }[] = [
      {
        id: "rooms",
        label: "Kamar",
        icon: DoorOpen,
      },
      {
        id: "billing",
        label: "Tagihan",
        icon: ReceiptText,
        badge: stats.overdue.length > 0 ? stats.overdue.length : null,
      },
      {
        id: "dashboard",
        label: "Beranda",
        icon: Home,
      },
      {
        id: "staff",
        label: "Staf",
        icon: ClipboardCheck,
      },
    ];

  // Determine active slot (0..4); default to 2 (Beranda in center) or 4 (Menu) for secondary pages
  const pageIdx = navItems.findIndex((item) => item.id === page);
  const targetIdx = mobileMenuOpen ? 4 : pageIdx >= 0 ? pageIdx : 4;
  const targetCx = SLOT_CENTERS[targetIdx] ?? 200;

  const [animCx, setAnimCx] = useState(targetCx);
  const [collapsed, setCollapsed] = useState(false);
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
      badge: item.badge ?? null,
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
  const notchPath = buildNotchPath(animCx);

  if (collapsed) {
    return (
      <div className="lg:hidden fixed bottom-3 right-3.5 z-40 safe-pb">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-label="Buka Navigasi Bawah"
          className="flex items-center gap-1.5 rounded-full border border-white/30 bg-[#332924]/85 backdrop-blur-xl px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] shadow-lg active:scale-95 transition-all"
        >
          <ChevronUp className="size-4 text-[#E5C99B]" />
          <span>Navigasi</span>
        </button>
      </div>
    );
  }

  return (
    <div className="lg:hidden fixed bottom-3 inset-x-0 z-40 px-3.5 pointer-events-none safe-pb">
      <nav
        aria-label="Navigasi Bawah"
        className="pointer-events-auto relative mx-auto w-full max-w-[390px] aspect-[400/88] select-none"
      >
        {/* Collapse toggle button to hide bottom navbar for full screen on mobile */}
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          title="Sembunyikan Navigasi (Layar Penuh)"
          aria-label="Sembunyikan Navigasi"
          className="absolute -top-2 right-1 z-20 flex size-6 items-center justify-center rounded-full border border-white/30 bg-[#332924]/80 backdrop-blur-md text-stone-200 shadow-sm hover:text-white active:scale-90"
        >
          <ChevronDown className="size-3.5" />
        </button>
        {/* SVG Liquid Notch Translucent Frosted Glass Pill */}
        <svg
          viewBox="0 0 400 88"
          className="w-full h-full drop-shadow-[0_12px_28px_rgba(43,34,30,0.28)]"
          fill="none"
        >
          <defs>
            <clipPath id="liquidNotchClip">
              <path d={notchPath} />
            </clipPath>
            <linearGradient
              id="navGlassFill"
              x1="200"
              y1="22"
              x2="200"
              y2="84"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#3F332D" stopOpacity="0.62" />
              <stop offset="55%" stopColor="#332924" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#4A3B34" stopOpacity="0.68" />
            </linearGradient>
            <linearGradient
              id="navGlassStroke"
              x1="200"
              y1="20"
              x2="200"
              y2="85"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#D4B483" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* True Frosted Glass Backdrop Blur clipped to the liquid notch path */}
          <foreignObject
            x="0"
            y="0"
            width="400"
            height="88"
            clipPath="url(#liquidNotchClip)"
          >
            <div className="w-full h-full bg-[#332924]/60 backdrop-blur-xl backdrop-saturate-150" />
          </foreignObject>

          {/* Translucent Glass Tint & Crisp Highlight Border */}
          <path
            d={notchPath}
            fill="url(#navGlassFill)"
            stroke="url(#navGlassStroke)"
            strokeWidth="1.4"
          />
        </svg>

        {/* Floating Active Circle Orb — Warm Cinnamon-Mocha with 9px gap inside the notch */}
        <button
          type="button"
          onClick={allSlots[targetIdx]?.onClick}
          aria-label={allSlots[targetIdx]?.label}
          style={{
            left: `${(animCx / 400) * 100}%`,
            top: `${(18 / 88) * 100}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex size-[40px] items-center justify-center rounded-full bg-gradient-to-b from-[#9B724D]/95 to-[#735335]/95 backdrop-blur-md text-white shadow-[0_6px_16px_rgba(115,83,53,0.45)] ring-1 ring-white/50 transition-transform active:scale-95"
        >
          <div className="relative">
            <ActiveIcon className="size-[19px]" strokeWidth={2.1} />
            {activeBadge && (
              <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-[#F43F5E] text-[9px] font-extrabold text-white ring-1 ring-white/60">
                {activeBadge}
              </span>
            )}
          </div>
        </button>

        {/* 5 Menu Slots with Icons + Text Labels */}
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
              style={{
                left: `${(slotCx / 400) * 100}%`,
                top: `${(54 / 88) * 100}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex w-[64px] flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95"
            >
              {/* Icon inside the bar (hidden when lifted into the floating orb) */}
              <div
                className={`relative flex h-6 items-center justify-center transition-all duration-200 ${isCurrent
                    ? "opacity-0 -translate-y-3 pointer-events-none scale-75"
                    : "opacity-90 text-[#FAF8F5]"
                  }`}
              >
                <Icon className="size-[19px]" strokeWidth={1.9} />
                {slot.badge && (
                  <span className="absolute -top-1 -right-2.5 flex size-4 items-center justify-center rounded-full bg-[#F43F5E] text-[9px] font-extrabold text-white">
                    {slot.badge}
                  </span>
                )}
              </div>

              {/* Text Label — always visible for every item */}
              <span
                className={`mt-0.5 text-[10px] leading-none tracking-wide transition-colors ${isCurrent
                    ? "font-bold text-[#E5C99B]"
                    : "font-medium text-[#FAF8F5]/80"
                  }`}
              >
                {slot.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
