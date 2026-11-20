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
import { useStore, type Page, type FinanceTab } from "@/store/store"

export default function Sidebar() {
  const router = useRouter()
  const s = useStore()
  const { page, financeTab } = s

  const displayName =
    s.userProfile?.full_name ||
    (s.userRole === "staff" ? "Pak Darto" : "Muhamad Maulana")
  const roleLabel =
    s.userProfile?.role === "staff" || s.userRole === "staff"
      ? "Penjaga Kost (Staf)"
      : "Owner / Manager"
  const userInitials =
    displayName
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
  ]

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-[212px] flex-col bg-[#1C2426] text-stone-200 border-r border-white/[0.07]">
      <div className="flex h-[68px] items-center justify-between border-b border-white/[0.07] px-4">
        <Link href="/" className="flex items-center">
          <span className="font-display text-[17px] font-bold tracking-[-0.04em] text-[#FAF8F5]">
            SUPERKOST
          </span>
          <span className="ml-1 size-1.5 rounded-full bg-[#D4B483]" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-3.5">
        <p className="px-2.5 pb-2 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-stone-400/80">
          Modul Operasional
        </p>
        <ul className="space-y-0.5">
          {items.map((it) => {
            const Icon = it.icon
            const on = page === it.page && (!it.tab || it.tab === financeTab)
            return (
              <li key={it.label}>
                <button
                  onClick={() => s.navigate(it.page, it.tab)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium transition-all ${
                    on
                      ? "bg-gradient-to-r from-[#246358] to-[#1D5248] text-white shadow-sm ring-1 ring-white/15"
                      : "text-stone-300/85 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`size-4 shrink-0 ${
                      on
                        ? "text-[#E5C99B]"
                        : "text-stone-400 group-hover:text-stone-200"
                    }`}
                    strokeWidth={1.8}
                  />
                  <span className="min-w-0 flex-1 truncate">{it.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/[0.07] p-2.5 space-y-1.5">
        <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left bg-white/[0.04] border border-white/[0.06]">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#246358] text-[10.5px] font-bold text-[#E5C99B] ring-1 ring-white/15">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11.5px] font-semibold text-[#FAF8F5]">
              {displayName}
            </p>
            <p className="truncate text-[10px] text-stone-400">
              {roleLabel}
            </p>
          </div>
        </div>

        <div className="space-y-0.5">
          <Link
            href="/"
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11.5px] font-medium text-stone-300/85 hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            <Home className="size-3.5 shrink-0 text-stone-400" />
            <span>Ke Halaman Depan</span>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await s.signOut()
              router.push("/login")
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11.5px] font-medium text-rose-300/90 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
          >
            <LogOut className="size-3.5 shrink-0 text-rose-400" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
