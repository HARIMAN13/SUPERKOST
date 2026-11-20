import {
  Building2,
  Check,
  ChevronDown,
  Search,
  Bell,
  Plus,
  Wallet,
  UserPlus,
  TriangleAlert,
  AirVent,
  AlertCircle,
  CornerDownLeft,
  DoorOpen,
  Menu,
  Home,
  LogOut,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  Maximize2,
  Minimize2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { useStore } from "@/store/store"
import { rupiah } from "@/lib/data"

function useOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && cb()
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [ref, cb])
}

export default function Topbar() {
  const router = useRouter()
  const s = useStore()
  const [open, setOpen] = useState<null | "prop" | "cta" | "bell" | "search" | "user">(
    null,
  )
  const [q, setQ] = useState("")
  const [cursor, setCursor] = useState(0)
  const [seen, setSeen] = useState<Record<string, boolean>>({})
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Fallback: toggle sidebar full width
      s.setSidebarOpen(!s.sidebarOpen)
    }
  }
  const propRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)
  const searchWrap = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const close = () => setOpen(null)
  useOutside(propRef, () => open === "prop" && close())
  useOutside(ctaRef, () => open === "cta" && close())
  useOutside(bellRef, () => open === "bell" && close())
  useOutside(searchWrap, () => open === "search" && close())
  useOutside(userRef, () => open === "user" && close())

  const displayName = s.userProfile?.full_name || (s.userRole === "staff" ? "Pak Darto" : "Muhamad Maulana")
  const displayEmail = s.currentUser?.email || (s.userRole === "staff" ? "darto.staf@superkost.id" : "maulana@superkost.id")
  const roleLabel = s.userProfile?.role === "staff" || s.userRole === "staff" ? "Penjaga Kost (Staf)" : "Owner / Manager"
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SK"

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        searchRef.current?.focus()
        setOpen("search")
      }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    const digits = term.replace(/\D/g, "")
    return s.rooms
      .filter((r) => {
        const t = s.tenants.find((x) => x.id === r.tenantId)
        return (
          String(r.no).includes(term) ||
          r.tenant?.toLowerCase().includes(term) ||
          (digits.length >= 3 &&
            t?.phone.replace(/\D/g, "").includes(digits)) ||
          (term.includes("kosong") && r.status === "vacant")
        )
      })
      .slice(0, 8)
  }, [q, s.rooms, s.tenants])

  const pick = (no: number) => {
    const r = s.rooms.find((x) => x.no === no)!
    if (r.status === "vacant") s.openModal({ type: "checkIn", roomNo: no })
    else s.openDrawer(no)
    setQ("")
    close()
    searchRef.current?.blur()
  }

  const notifs = [
    ...s.stats.overdue.map((r) => ({
      id: `inv-${r.no}`,
      icon: AlertCircle,
      tone: "text-[#F43F5E] bg-[#F43F5E]/10",
      title: `Tagihan Kamar ${r.no} jatuh tempo`,
      sub: `${r.tenant} · nunggak ${r.overdueDays} hari · ${rupiah(r.price)}`,
      go: () => s.openDrawer(r.no),
    })),
    ...s.stats.acOverdue.map((u) => ({
      id: `ac-${u.room}`,
      icon: AirVent,
      tone: "text-amber-600 bg-[#F59E0B]/12",
      title: `Servis AC Kamar ${u.room} jatuh tempo`,
      sub: `${u.brand} ${u.pk} · melebihi siklus 5 bulan`,
      go: () => s.navigate("maintenance"),
    })),
  ]
  const unread = notifs.filter((n) => !seen[n.id]).length

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center gap-2.5 sm:gap-3 border-b border-[#E6E2D8] bg-white/95 backdrop-blur-md px-3 sm:px-5">
      {/* Desktop sidebar open/close toggle button */}
      <button
        type="button"
        onClick={() => s.setSidebarOpen(!s.sidebarOpen)}
        className="hidden lg:flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E6E2D8] bg-[#FAF8F5] text-[#1C2426] hover:border-[#1F5E53] hover:text-[#1F5E53] transition-colors"
        title={s.sidebarOpen ? "Tutup Sidebar (Lebarkan Layar)" : "Buka Sidebar"}
        aria-label="Toggle Sidebar"
      >
        {s.sidebarOpen ? (
          <PanelLeftClose className="size-4" />
        ) : (
          <PanelLeftOpen className="size-4" />
        )}
      </button>

      {/* Mobile hamburger menu toggle */}
      <button
        type="button"
        onClick={() => s.setMobileMenuOpen(true)}
        className="lg:hidden flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E6E2D8] text-stone-700 hover:bg-stone-100"
        aria-label="Buka menu navigasi"
      >
        <Menu className="size-5" />
      </button>

      {/* Property switcher */}
      <div ref={propRef} className="relative shrink-0">
        <button
          onClick={() => setOpen(open === "prop" ? null : "prop")}
          className="flex items-center gap-2 sm:gap-2.5 rounded-lg border border-[#E6E2D8] bg-[#FAF8F5] py-1.5 pl-1.5 pr-2.5 sm:pr-3 hover:border-stone-300 transition-colors"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#1F5E53] text-[#C5A572]">
            <Building2 className="size-4" strokeWidth={1.8} />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[13px] font-semibold leading-tight text-[#1C2426] truncate max-w-[180px] xl:max-w-none">
              {s.property.name}{" "}
              <span className="font-normal text-stone-500">
                ({s.rooms.length} Kamar)
              </span>
            </p>
            <p className="text-[11px] leading-tight text-stone-500">
              {s.property.area}
            </p>
          </div>
          <ChevronDown
            className={`ml-0.5 size-4 text-stone-400 transition-transform ${
              open === "prop" ? "rotate-180" : ""
            }`}
          />
        </button>
        {open === "prop" && (
          <div className="absolute left-0 top-full mt-1.5 w-[320px] rounded-xl border border-[#E6E2D8] bg-white p-1.5 shadow-xl shadow-stone-900/10 z-50">
            <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              Portofolio Properti
            </p>
            {s.propertySummaries.map((x) => (
              <button
                key={x.id}
                onClick={() => {
                  if (x.id !== s.propId) s.switchProperty(x.id)
                  close()
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-[#FAF8F5] ${
                  x.id === s.propId ? "bg-[#EEF5F3]" : ""
                }`}
              >
                <Building2
                  className="size-4 text-stone-500"
                  strokeWidth={1.8}
                />
                <div className="flex-1">
                  <p className="text-[12.5px] font-medium text-[#1C2426]">
                    {x.name}{" "}
                    <span className="text-stone-500">({x.rooms} Kamar)</span>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {x.area} ·{" "}
                    <span
                      className={
                        x.overdue ? "text-rose-600" : "text-emerald-700"
                      }
                    >
                      {x.overdue} nunggak
                    </span>
                  </p>
                </div>
                {x.id === s.propId && (
                  <Check className="size-4 text-[#1F5E53]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick link back to landing page */}
      <Link
        href="/"
        className="hidden xl:inline-flex items-center gap-1.5 rounded-lg border border-[#E6E2D8] bg-white px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-[#FAF8F5] hover:text-[#1C2426] transition-colors shrink-0 whitespace-nowrap"
        title="Kembali ke Halaman Depan"
      >
        <Home className="size-3.5 text-stone-500" />
        <span>Ke Beranda</span>
      </Link>

      {/* Global search — proper min-width so it never collapses or overlaps */}
      <div
        ref={searchWrap}
        className="relative min-w-[200px] max-w-[440px] flex-1 hidden md:block"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <input
          ref={searchRef}
          value={q}
          onFocus={() => setOpen("search")}
          onChange={(e) => {
            setQ(e.target.value)
            setCursor(0)
            setOpen("search")
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown")
              setCursor((c) => Math.min(results.length - 1, c + 1))
            if (e.key === "ArrowUp") setCursor((c) => Math.max(0, c - 1))
            if (e.key === "Enter" && results[cursor]) pick(results[cursor].no)
            if (e.key === "Escape") {
              close()
              searchRef.current?.blur()
            }
          }}
          placeholder={
            s.rooms.length
              ? `Cari penghuni, kamar ${s.rooms[0]?.no}–${s.rooms[s.rooms.length - 1]?.no}, atau no. HP...`
              : "Cari nama penghuni atau nomor kamar..."
          }
          className="h-10 w-full rounded-lg border border-[#E6E2D8] bg-[#FAF8F5] pl-9 pr-3 xl:pr-16 text-[12.5px] text-[#1C2426] outline-none placeholder:text-stone-400 focus:border-[#1F5E53] focus:bg-white focus:ring-2 focus:ring-[#1F5E53]/12"
        />
        <kbd className="hidden xl:inline-block pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[#E6E2D8] bg-white px-1.5 py-0.5 font-sans text-[10px] font-medium text-stone-500 whitespace-nowrap">
          Ctrl K
        </kbd>
        {open === "search" && q.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1.5 overflow-hidden rounded-xl border border-[#E6E2D8] bg-white shadow-xl shadow-stone-900/10 z-50">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-[12px] text-stone-500">
                Tidak ada kamar atau penghuni yang cocok dengan &ldquo;{q}&rdquo;.
              </p>
            ) : (
              <ul className="p-1.5">
                {results.map((r, i) => {
                  const st = {
                    paid: ["Lunas", "text-emerald-700 bg-[#10B981]/10"],
                    overdue: ["Nunggak", "text-rose-700 bg-[#F43F5E]/10"],
                    verify: ["Verifikasi", "text-amber-700 bg-[#F59E0B]/12"],
                    vacant: ["Kosong", "text-stone-600 bg-stone-100"],
                  }[r.status]
                  return (
                    <li key={r.no}>
                      <button
                        onMouseEnter={() => setCursor(i)}
                        onClick={() => pick(r.no)}
                        className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${
                          i === cursor ? "bg-[#EEF5F3]" : ""
                        }`}
                      >
                        <span className="flex size-8 items-center justify-center rounded-md border border-[#E6E2D8] bg-white text-stone-500">
                          <DoorOpen className="size-4" strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-semibold text-[#1C2426]">
                            Kamar {r.no}{" "}
                            <span className="font-normal text-stone-500">
                              · {r.type}
                            </span>
                          </span>
                          <span className="block truncate text-[11px] text-stone-500">
                            {r.tenant ?? `Siap huni · ${rupiah(r.price)}`}
                          </span>
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${st[1]}`}
                        >
                          {st[0]}
                        </span>
                        {i === cursor && (
                          <CornerDownLeft className="size-3.5 text-stone-400" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Fullscreen toggle button */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh (Full Screen)"}
          aria-label="Toggle Fullscreen"
          className="hidden sm:flex size-10 items-center justify-center rounded-lg border border-[#E6E2D8] text-stone-600 hover:bg-[#FAF8F5] hover:text-[#1F5E53] transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </button>

        <div className="hidden 2xl:flex items-center gap-2 rounded-lg border border-[#10B981]/25 bg-[#10B981]/[0.06] px-2.5 py-1.5 shrink-0">
          <span className="size-2 rounded-full bg-[#10B981]" />
          <div className="leading-tight whitespace-nowrap">
            <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-700/80">
              WA Auto-Billing
            </p>
            <p className="text-[11.5px] font-semibold text-emerald-800">
              Aktif (08:00 WIB)
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div ref={bellRef} className="relative shrink-0">
          <button
            onClick={() => setOpen(open === "bell" ? null : "bell")}
            aria-label="Notifikasi"
            className={`relative flex size-10 items-center justify-center rounded-lg border border-[#E6E2D8] text-stone-600 hover:bg-[#FAF8F5] ${
              open === "bell" ? "bg-[#FAF8F5]" : ""
            }`}
          >
            <Bell className="size-[18px]" strokeWidth={1.8} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#F43F5E] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </button>
          {open === "bell" && (
            <div className="absolute right-0 top-full mt-1.5 w-[340px] sm:w-[360px] overflow-hidden rounded-xl border border-[#E6E2D8] bg-white shadow-xl shadow-stone-900/10 z-50">
              <div className="flex items-center justify-between border-b border-[#E6E2D8] px-4 py-2.5">
                <p className="text-[13px] font-semibold text-[#1C2426]">
                  Notifikasi
                </p>
                <button
                  onClick={() =>
                    setSeen(Object.fromEntries(notifs.map((n) => [n.id, true])))
                  }
                  className="text-[11.5px] font-semibold text-[#1F5E53] hover:text-[#1C2426] disabled:text-stone-300"
                  disabled={!unread}
                >
                  Tandai semua dibaca
                </button>
              </div>
              {notifs.length === 0 ? (
                <p className="px-4 py-8 text-center text-[12px] text-stone-500">
                  Tidak ada peringatan. Operasional aman.
                </p>
              ) : (
                <ul className="max-h-[360px] divide-y divide-[#E6E2D8] overflow-y-auto">
                  {notifs.map((n) => {
                    const Icon = n.icon
                    return (
                      <li key={n.id}>
                        <button
                          onClick={() => {
                            setSeen((x) => ({ ...x, [n.id]: true }))
                            close()
                            n.go()
                          }}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-[#FAF8F5]"
                        >
                          <span
                            className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${n.tone}`}
                          >
                            <Icon className="size-3.5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12.5px] font-semibold text-[#1C2426]">
                              {n.title}
                            </span>
                            <span className="block truncate text-[11px] text-stone-500">
                              {n.sub}
                            </span>
                          </span>
                          {!seen[n.id] && (
                            <span className="mt-1.5 size-2 rounded-full bg-[#1F5E53]" />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Primary CTA */}
        <div ref={ctaRef} className="relative shrink-0">
          <button
            onClick={() => setOpen(open === "cta" ? null : "cta")}
            className="flex h-10 items-center gap-1.5 sm:gap-2 rounded-lg bg-[#1F5E53] pl-2.5 sm:pl-3.5 pr-2 sm:pr-2.5 text-[12px] sm:text-[13px] font-semibold text-[#FAF8F5] hover:bg-[#184B42] shrink-0 whitespace-nowrap"
          >
            <Plus className="size-4 shrink-0 text-[#C5A572]" strokeWidth={2.4} />
            <span className="hidden sm:inline">Entri Transaksi Baru</span>
            <span className="sm:hidden">Transaksi</span>
            <span className="ml-0.5 sm:ml-1 h-5 w-px bg-white/20" />
            <ChevronDown
              className={`size-3.5 sm:size-4 transition-transform ${
                open === "cta" ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === "cta" && (
            <div className="absolute right-0 top-full mt-1.5 w-[260px] rounded-xl border border-[#E6E2D8] bg-white p-1.5 shadow-xl shadow-stone-900/10 z-50">
              {[
                {
                  icon: Wallet,
                  label: "Catat Bayar Sewa",
                  sub: "Pembayaran tunai / transfer",
                  c: "text-[#10B981] bg-[#10B981]/10",
                  go: () => s.openModal({ type: "payment" }),
                },
                {
                  icon: UserPlus,
                  label: "Pasang Penghuni Baru",
                  sub: "Check-in & kontrak digital",
                  c: "text-[#1F5E53] bg-[#EEF5F3]",
                  go: () => s.openModal({ type: "checkIn" }),
                },
                {
                  icon: TriangleAlert,
                  label: "Lapor Kerusakan",
                  sub: "Tiket servis AC / fasilitas",
                  c: "text-[#F43F5E] bg-[#F43F5E]/10",
                  go: () => s.openModal({ type: "ticket" }),
                },
              ].map(({ icon: Icon, label, sub, c, go }) => (
                <button
                  key={label}
                  onClick={() => {
                    close()
                    go()
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-[#FAF8F5]"
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-md ${c}`}
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="block text-[12.5px] font-semibold text-[#1C2426]">
                      {label}
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      {sub}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User profile dropdown with Logout & Back */}
        <div ref={userRef} className="relative shrink-0">
          <button
            onClick={() => setOpen(open === "user" ? null : "user")}
            aria-label="Profil Pengguna"
            className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-stone-100 transition-colors"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-[#1F5E53] text-[12px] font-bold text-[#C5A572] ring-2 ring-[#C5A572]/25">
              {userInitials}
            </div>
            <ChevronDown
              className={`hidden sm:block size-3.5 text-stone-400 transition-transform ${
                open === "user" ? "rotate-180" : ""
              }`}
            />
          </button>

          {open === "user" && (
            <div className="absolute right-0 top-full mt-2 w-[240px] rounded-xl border border-[#E6E2D8] bg-white p-2 shadow-xl shadow-stone-900/10 z-50 animate-pop-in">
              <div className="border-b border-stone-100 px-3 py-2">
                <p className="text-[13px] font-bold text-[#1C2426]">
                  {displayName}
                </p>
                <p className="text-[11px] text-stone-500 truncate">
                  {displayEmail}
                </p>
                <span className="mt-1 inline-block rounded-md bg-[#EEF5F3] px-1.5 py-0.5 text-[10px] font-semibold text-[#1F5E53]">
                  {roleLabel}
                </span>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  href="/"
                  onClick={close}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium text-stone-700 hover:bg-[#FAF8F5] transition-colors"
                >
                  <Home className="size-4 text-stone-500" />
                  <span>Ke Halaman Depan</span>
                </Link>

                <button
                  onClick={() => {
                    close()
                    s.navigate("staff")
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium text-stone-700 hover:bg-[#FAF8F5] transition-colors"
                >
                  <UserCheck className="size-4 text-stone-500" />
                  <span>Mode Kasir Staf (Pak Darto)</span>
                </button>
              </div>

              <div className="border-t border-stone-100 pt-1">
                <button
                  type="button"
                  onClick={async () => {
                    close()
                    await s.signOut()
                    router.push("/login")
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="size-4 text-rose-500" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
