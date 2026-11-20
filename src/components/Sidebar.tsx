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
  Home,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { useStore, type Page, type FinanceTab } from "@/store/store"

const pill = (text: string, cls: string) => (
  <span
    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none tabular-nums ${cls}`}
  >
    {text}
  </span>
)

export default function Sidebar() {
  const router = useRouter()
  const s = useStore()
  const { stats, rooms, page, financeTab } = s
  const juta = (n: number) => `Rp${Math.round(n / 1_000_000)} Jt`

  const displayName = s.userProfile?.full_name || (s.userRole === "staff" ? "Pak Darto" : "Muhamad Maulana")
  const roleLabel = s.userProfile?.role === "staff" || s.userRole === "staff" ? "Penjaga Kost (Staf)" : "Owner / Manager"
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SK"

  const items: {
    icon: typeof LayoutDashboard
    label: string
    page: Page
    tab?: FinanceTab
    meta?: ReactNode
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
        "bg-[#F59E0B]/15 text-[#FCD34D]",
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
            "bg-[#F59E0B] text-[#1E1B4B]",
          )
        : undefined,
    },
    {
      icon: ClipboardCheck,
      label: "Checklist Kerja Staf Penjaga",
      page: "staff",
      meta: pill(
        `${s.tasks.filter((t) => t.done).length}/${s.tasks.length}`,
        "bg-white/10 text-indigo-100",
      ),
    },
    {
      icon: MessageSquareText,
      label: "Mesin WhatsApp Gateway",
      page: "whatsapp",
    },
  ]

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-[260px] flex-col bg-[#1E1B4B] text-indigo-100">
      <div className="flex h-[72px] items-center gap-2.5 border-b border-white/[0.06] px-5">
        <div className="flex items-baseline">
          <span className="font-display text-[19px] font-extrabold tracking-[0.08em] text-white">
            SUPERKOST
          </span>
          <span className="ml-0.5 size-2 rounded-full bg-[#6366F1]" />
        </div>
        <span className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-indigo-200">
          v1.0 Enterprise
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-300/60">
          Modul Operasional
        </p>
        <ul className="space-y-0.5">
          {items.map((it, i) => {
            const Icon = it.icon
            const on = page === it.page && (!it.tab || it.tab === financeTab)
            return (
              <li key={it.label}>
                <button
                  onClick={() => s.navigate(it.page, it.tab)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium transition-colors ${
                    on
                      ? "bg-[#4F46E5] text-white"
                      : "text-indigo-200/85 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 ${
                      on
                        ? "text-white"
                        : "text-indigo-300/70 group-hover:text-indigo-100"
                    }`}
                    strokeWidth={1.8}
                  />
                  <span className="min-w-0 flex-1 truncate">{it.label}</span>
                  {it.meta}
                </button>
                {i === 9 && (
                  <div className="ml-9 mt-1 flex items-center gap-1.5 text-[10.5px] text-indigo-300/80">
                    <span className="relative flex size-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#10B981] opacity-60" />
                      <span className="relative size-1.5 rounded-full bg-[#10B981]" />
                    </span>
                    Connected · Fonnte API
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/[0.06] p-3 space-y-2">
        <div className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left bg-white/[0.02]">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#312E81] text-[11px] font-bold text-white ring-1 ring-white/10">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-white">
              {displayName}
            </p>
            <p className="truncate text-[10.5px] text-indigo-300/80">
              {roleLabel}
            </p>
          </div>
        </div>

        <div className="space-y-0.5 pt-0.5">
          <Link
            href="/"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium text-indigo-200/80 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <Home className="size-4 shrink-0 text-indigo-300/70" />
            <span>Ke Halaman Depan</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await s.signOut()
              router.push("/login")
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[12px] font-medium text-rose-300/90 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
          >
            <LogOut className="size-4 shrink-0 text-rose-400" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
