/* eslint-disable @next/next/no-img-element */
import {
  X,
  MoreHorizontal,
  Pencil,
  ArrowRightLeft,
  MessageCircle,
  Phone,
  CalendarDays,
  Repeat,
  HeartHandshake,
  BadgeCheck,
  Vault,
  Lock,
  AlertTriangle,
  Send,
  HandCoins,
  LogOut,
  CheckCircle2,
  Clock,
  AirVent,
  BedDouble,
  Archive,
  Lamp,
  ShowerHead,
  Wifi,
  Tv,
  Receipt,
  ArrowDownLeft,
  ShieldCheck,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { rupiah, fmtDate, initials, type Room } from "@/lib/data"
import { useStore, type Store } from "@/store/store"
import { waLink } from "@/lib/lib"

interface Detail {
  phone: string
  start: string
  dueDay: number
  emergency: { name: string; rel: string; phone: string }
  deposit: number
  bank: string
  ktp?: string
  paidOn?: string
  method?: string
}

function getDetail(s: Store, r: Room): Detail {
  const t = s.tenants.find((x) => x.id === r.tenantId)
  const dep = s.deposits.find(
    (x) => x.tenantId === r.tenantId && x.status !== "refunded",
  )
  const inv = s.invoices.find((x) => x.id === r.invoiceId)
  return {
    phone: t?.phone ?? "-",
    start: t ? fmtDate(t.start) : "-",
    dueDay: t?.dueDay ?? 1,
    emergency: t?.emergency ?? { name: "-", rel: "-", phone: "-" },
    deposit: dep?.amount ?? 0,
    bank: t?.bank ?? "BCA",
    ktp: t?.ktp,
    paidOn: inv?.paidOn ? fmtDate(inv.paidOn) : undefined,
    method: inv?.method,
  }
}

type Tab = "tenant" | "inventory" | "history"

export default function RoomDrawer({
  room,
  onClose,
  onCheckout,
}: {
  room: Room | null
  onClose: () => void
  onCheckout: (r: Room) => void
}) {
  const store = useStore()
  const [current, setCurrent] = useState<Room | null>(room)
  const [shown, setShown] = useState(false)
  const [tab, setTab] = useState<Tab>("tenant")
  const [menu, setMenu] = useState(false)
  const [sent, setSent] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Keep the last room mounted while the exit transition plays.
  useEffect(() => {
    if (room) {
      setCurrent(room)
      const id = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(id)
    }
    setShown(false)
    const t = window.setTimeout(() => setCurrent(null), 260)
    return () => window.clearTimeout(t)
  }, [room])

  useEffect(() => {
    setTab("tenant")
    setSent(false)
    setMenu(false)
  }, [room?.no])

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    const m = (e: MouseEvent) =>
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      setMenu(false)
    window.addEventListener("keydown", k)
    document.addEventListener("mousedown", m)
    return () => {
      window.removeEventListener("keydown", k)
      document.removeEventListener("mousedown", m)
    }
  }, [onClose])

  if (!current) return null
  const r = current
  const d = getDetail(store, r)
  const floorName = `Gedung Utama Lantai ${r.floor}`

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Kamar ${r.no}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#423020]/45 backdrop-blur-[3px] transition-opacity duration-250 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-[540px] flex-col border-l border-[#E6E2D8] bg-white shadow-2xl shadow-stone-950/20 transition-transform duration-250 ease-out ${
          shown ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="px-6 pb-0 pt-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-[19px] font-bold tracking-tight text-[#2B211A]">
                  Kamar {r.no}{" "}
                  <span className="font-semibold text-slate-300">•</span> Tipe{" "}
                  {r.type}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-inset ring-[#10B981]/25">
                  <span className="size-1.5 rounded-full bg-[#10B981]" /> Terisi
                  Aktif
                </span>
              </div>
              <p className="mt-1 text-[12.5px] text-slate-500">
                {floorName} <span className="text-slate-300">•</span> Tarif
                Sewa:{" "}
                <span className="font-semibold text-slate-700">
                  {rupiah(r.price)} / Bulan
                </span>
              </p>
            </div>
            <div ref={menuRef} className="relative flex items-center gap-1">
              <button
                onClick={() => setMenu((m) => !m)}
                aria-label="Menu konteks"
                className={`flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 ${
                  menu ? "bg-slate-100 text-slate-800" : ""
                }`}
              >
                <MoreHorizontal className="size-[18px]" />
              </button>
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="size-[18px]" />
              </button>
              {menu && (
                <div className="absolute right-9 top-full z-10 mt-1 w-[190px] rounded-xl border border-[#E6E2D8] bg-white p-1 shadow-lg shadow-slate-900/8">
                  {[
                    {
                      icon: Pencil,
                      label: "Edit Tarif",
                      kind: "tarif" as const,
                    },
                    {
                      icon: ArrowRightLeft,
                      label: "Pindahkan Kamar",
                      kind: "move" as const,
                    },
                  ].map(({ icon: Icon, label, kind }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setMenu(false)
                        store.openModal({
                          type: "roomAction",
                          kind,
                          roomNo: r.no,
                        })
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Icon className="size-3.5 text-slate-400" /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <nav className="-mx-6 mt-4 flex gap-6 border-b border-[#E6E2D8] px-6">
            {([
              ["tenant", "Data Penghuni & Sewa"],
              ["inventory", "Inventaris Fasilitas"],
              ["history", "Riwayat Tagihan & Deposit"],
            ] as [Tab, string][]).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`relative -mb-px border-b-2 pb-2.5 text-[12.5px] transition-colors ${
                  tab === k
                    ? "border-[#5C432C] font-semibold text-[#2B211A]"
                    : "border-transparent font-medium text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#FAF8F5] px-6 py-5">
          {tab === "tenant" && (
            <div className="space-y-4">
              <TenantCard r={r} d={d} />
              <DepositBanner d={d} />
              <Billing
                r={r}
                sent={sent}
                onSend={() => {
                  setSent(true)
                  store.sendReminder([r.no], "Template Tunggakan H+1")
                }}
                onMarkPaid={() =>
                  store.openModal({
                    type: "payment",
                    roomNo: r.no,
                    method: "Tunai",
                  })
                }
                onApprove={() => store.approvePayment(r.no)}
              />
            </div>
          )}
          {tab === "inventory" && <Inventory r={r} />}
          {tab === "history" && <History r={r} d={d} />}
        </div>

        {/* Footer */}
        <footer className="border-t border-[#E6E2D8] bg-white px-6 py-4">
          <button
            onClick={() => onCheckout(r)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#F43F5E] text-[13px] font-semibold text-[#E11D48] transition-colors hover:bg-[#FFF1F2]"
          >
            <LogOut className="size-4" strokeWidth={2} />
            Proses Pelepasan & Check-Out Penghuni (Clearance Deposit)
          </button>
        </footer>
      </aside>
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">
      {children}
    </p>
  )
}

function TenantCard({ r, d }: { r: Room; d: Detail }) {
  return (
    <section className="rounded-xl border border-[#E6E2D8] bg-white p-4">
      <div className="flex items-center gap-3.5">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#F6EFE6] font-display text-[18px] font-bold text-[#5C432C] ring-1 ring-[#E2D3C1]">
          {initials(r.tenant)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[16px] font-bold text-[#2B211A]">
            {r.tenant}
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <Phone className="size-3.5 text-slate-400" />
            <span className="text-[12.5px] text-slate-600 tabular-nums">
              {d.phone}
            </span>
          </div>
        </div>
        <button
          onClick={() =>
            window.open(
              waLink(d.phone, `Halo Kak ${r.tenant}, `),
              "_blank",
              "noopener",
            )
          }
          aria-label="Chat WhatsApp"
          className="flex size-10 items-center justify-center rounded-full bg-[#10B981] text-white hover:bg-[#059669]"
        >
          <MessageCircle className="size-[18px]" strokeWidth={2.2} />
        </button>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E6E2D8] bg-[#FAF8F5] px-2 py-1 text-[11.5px] text-slate-600">
          <CalendarDays className="size-3.5 text-slate-400" /> Mulai Sewa:{" "}
          <span className="font-semibold text-slate-800">{d.start}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E6E2D8] bg-[#FAF8F5] px-2 py-1 text-[11.5px] text-slate-600">
          <Repeat className="size-3.5 text-slate-400" /> Siklus:{" "}
          <span className="font-semibold text-slate-800">Bulanan</span> (Jatuh
          Tempo: Tgl {d.dueDay})
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-3 border-t border-[#E6E2D8] pt-4">
        <div>
          <SectionLabel>Kontak Darurat</SectionLabel>
          <div className="flex items-center gap-2.5 rounded-lg border border-[#E6E2D8] p-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-[#F43F5E]/8 text-[#F43F5E]">
              <HeartHandshake className="size-4" strokeWidth={1.9} />
            </span>
            <div className="min-w-0">
              <p className="text-[12.5px] font-semibold text-slate-900">
                {d.emergency.name}{" "}
                <span className="font-normal text-slate-500">
                  ({d.emergency.rel})
                </span>
              </p>
              <p className="text-[11.5px] text-slate-500 tabular-nums">
                {d.emergency.phone}
              </p>
            </div>
          </div>
        </div>
        <div>
          <SectionLabel>Identitas</SectionLabel>
          <KtpThumb name={r.tenant ?? ""} src={d.ktp} />
        </div>
      </div>
    </section>
  )
}

function KtpThumb({ name, src }: { name: string; src?: string }) {
  if (src)
    return (
      <div className="w-[132px]">
        <div className="relative h-[60px] overflow-hidden rounded-lg border border-[#E2D3C1]">
          <img
            src={src}
            alt={`KTP ${name}`}
            className="size-full object-cover"
          />
          <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-bl-md bg-[#10B981]">
            <CheckCircle2 className="size-2.5 text-white" strokeWidth={3} />
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700">
          <BadgeCheck className="size-3.5 text-[#10B981]" /> KTP Terverifikasi
        </p>
      </div>
    )
  return (
    <div className="w-[132px]">
      <div className="relative h-[60px] overflow-hidden rounded-lg border border-[#E2D3C1] bg-[#F3F0EA] p-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[5.5px] font-bold uppercase tracking-wider text-[#5C432C]">
            Republik Indonesia
          </span>
          <span className="h-1 w-5 rounded bg-stone-700/30" />
        </div>
        <div className="mt-1 flex gap-1.5">
          <div className="flex-1 space-y-[3px] pt-0.5">
            <div className="h-[3px] w-full rounded bg-stone-700/35" />
            <p className="truncate text-[6px] font-semibold uppercase leading-none text-[#2B211A]">
              {name}
            </p>
            <div className="h-[3px] w-4/5 rounded bg-stone-700/20" />
            <div className="h-[3px] w-3/5 rounded bg-stone-700/20" />
            <div className="h-[3px] w-2/3 rounded bg-stone-700/20" />
          </div>
          <div className="flex h-[34px] w-[26px] items-end justify-center overflow-hidden rounded-[3px] bg-[#E2D3C1]">
            <div className="mb-[-6px] size-[18px] rounded-full bg-[#C5A572]" />
          </div>
        </div>
        <span className="absolute -right-0 -top-0 flex size-4 items-center justify-center rounded-bl-md bg-[#10B981]">
          <CheckCircle2 className="size-2.5 text-white" strokeWidth={3} />
        </span>
      </div>
      <p className="mt-1.5 flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700">
        <BadgeCheck className="size-3.5 text-[#10B981]" /> KTP Terverifikasi
      </p>
    </div>
  )
}

function DepositBanner({ d }: { d: Detail }) {
  return (
    <section className="flex gap-3 rounded-xl border border-[#E2D3C1] bg-[#F6EFE6] p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#5C432C] ring-1 ring-[#E2D3C1]">
        <Vault className="size-5" strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <p className="text-[13.5px] font-bold text-[#2B211A]">
          Uang Jaminan (Deposit) Tersimpan:{" "}
          <span className="tabular-nums">{rupiah(d.deposit)}</span>
        </p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-[#5C432C]/90">
          Disetor saat check-in pada {d.start}{" "}
          <span className="text-[#C5A572]">•</span> Status:{" "}
          <span className="inline-flex items-center gap-1 font-semibold text-[#5C432C]">
            <Lock className="size-3" strokeWidth={2.4} /> Terkunci Aman
          </span>{" "}
          & Siap Direkonsiliasi saat Checkout
        </p>
      </div>
    </section>
  )
}

function Billing({
  r,
  sent,
  onSend,
  onMarkPaid,
  onApprove,
}: {
  r: Room
  sent: boolean
  onSend: () => void
  onMarkPaid: () => void
  onApprove: () => void
}) {
  return (
    <section className="rounded-xl border border-[#E6E2D8] bg-white p-4">
      <SectionLabel>Tagihan Berjalan</SectionLabel>
      {r.status === "overdue" ? (
        <>
          <div className="flex gap-2.5 rounded-lg border-l-[3px] border-[#F43F5E] bg-[#FFF1F2] px-3 py-2.5">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-[#F43F5E]"
              strokeWidth={2.2}
            />
            <div>
              <p className="text-[12.5px] font-semibold leading-snug text-rose-900">
                Tagihan Periode November 2026 Menunggak {r.overdueDays} Hari{" "}
                <span className="whitespace-nowrap">
                  (Total: {rupiah(r.price)})
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-rose-700/80">
                Jatuh tempo terlewat · Denda keterlambatan belum diterapkan
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <button
              onClick={onSend}
              disabled={sent}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#5C432C] text-[12.5px] font-semibold text-white hover:bg-[#483422] disabled:bg-[#10B981]"
            >
              {sent ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Send className="size-4" />
              )}
              {sent
                ? "Pengingat Terkirim · Menunggu Balasan Penghuni"
                : "Kirim Pengingat Tagihan via WhatsApp (Template H+1)"}
            </button>
            <button
              onClick={onMarkPaid}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E6E2D8] bg-white text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <HandCoins className="size-4 text-slate-500" /> Catat Pelunasan
              Manual / Terima Uang Tunai
            </button>
          </div>
        </>
      ) : r.status === "verify" ? (
        <div className="flex gap-2.5 rounded-lg border-l-[3px] border-[#F59E0B] bg-[#FFFBEB] px-3 py-2.5">
          <Clock
            className="mt-0.5 size-4 shrink-0 text-[#F59E0B]"
            strokeWidth={2.2}
          />
          <div className="flex-1">
            <p className="text-[12.5px] font-semibold text-amber-900">
              Bukti Transfer Periode November 2026 Menunggu Verifikasi
            </p>
            <p className="mt-0.5 text-[11px] text-amber-700/80">
              Nominal {rupiah(r.price)} · Cek di Antrean Verifikasi Pembayaran
            </p>
          </div>
          <button
            onClick={onApprove}
            className="self-center rounded-md bg-[#10B981] px-2.5 py-1.5 text-[11.5px] font-semibold text-white hover:bg-[#059669]"
          >
            Setujui Lunas
          </button>
        </div>
      ) : (
        <div className="flex gap-2.5 rounded-lg border-l-[3px] border-[#10B981] bg-[#ECFDF5] px-3 py-2.5">
          <CheckCircle2
            className="mt-0.5 size-4 shrink-0 text-[#10B981]"
            strokeWidth={2.2}
          />
          <div>
            <p className="text-[12.5px] font-semibold text-emerald-900">
              Lunas hingga {r.paidUntil} 2026
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-700/80">
              Pengingat otomatis H-3 akan dikirim via Cron Job 08:00 WIB
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

function Inventory({ r }: { r: Room }) {
  const items = [
    {
      icon: AirVent,
      name: "AC Split 1 PK · Panasonic",
      code: `INV-${r.no}-01`,
      note:
        r.no === 204 ? "Cuci terjadwal 10 Nov 2026" : "Cuci terakhir Agu 2026",
      st: r.no === 204 ? "warn" : "ok",
    },
    {
      icon: BedDouble,
      name: "Kasur Spring Bed 120×200",
      code: `INV-${r.no}-02`,
      note: "Diganti Jan 2026",
      st: "ok",
    },
    {
      icon: Archive,
      name: "Lemari Pakaian 2 Pintu",
      code: `INV-${r.no}-03`,
      note: "Engsel kanan longgar",
      st: r.no % 3 === 0 ? "warn" : "ok",
    },
    {
      icon: Lamp,
      name: "Meja Belajar & Kursi",
      code: `INV-${r.no}-04`,
      note: "Kondisi baik",
      st: "ok",
    },
    {
      icon: ShowerHead,
      name: "Kamar Mandi Dalam + Water Heater",
      code: `INV-${r.no}-05`,
      note: "Servis heater Mei 2026",
      st: "ok",
    },
    {
      icon: Wifi,
      name: "Wi-Fi 50 Mbps (Shared)",
      code: `INV-${r.no}-06`,
      note: "Router Lantai " + r.floor,
      st: "ok",
    },
    {
      icon: Tv,
      name: 'Smart TV 32"',
      code: `INV-${r.no}-07`,
      note: "Khusus tipe " + r.type,
      st: r.type === "Deluxe" ? "ok" : "na",
    },
  ]
  return (
    <section className="rounded-xl border border-[#E6E2D8] bg-white">
      <div className="flex items-center justify-between border-b border-[#E6E2D8] px-4 py-3">
        <p className="text-[12.5px] font-semibold text-[#2B211A]">
          {items.filter((i) => i.st !== "na").length} Aset Terdaftar
        </p>
        <p className="text-[11px] text-slate-500">
          Dicek oleh penjaga · 01 Nov 2026
        </p>
      </div>
      <ul className="divide-y divide-[#E6E2D8]">
        {items.map(({ icon: Icon, name, code, note, st }) => (
          <li
            key={code}
            className={`flex items-center gap-3 px-4 py-2.5 ${
              st === "na" ? "opacity-50" : ""
            }`}
          >
            <span className="flex size-8 items-center justify-center rounded-md border border-[#E6E2D8] text-slate-500">
              <Icon className="size-4" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-slate-900">
                {name}
              </p>
              <p className="text-[11px] text-slate-500">
                {code} · {note}
              </p>
            </div>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                st === "ok"
                  ? "bg-[#10B981]/10 text-emerald-700"
                  : st === "warn"
                    ? "bg-[#F59E0B]/12 text-amber-700"
                    : "bg-slate-100 text-slate-500"
              }`}
            >
              {st === "ok"
                ? "Baik"
                : st === "warn"
                  ? "Perlu Servis"
                  : "Tidak Ada"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function History({ r, d }: { r: Room; d: Detail }) {
  const rows = [
    {
      p: "November 2026",
      st:
        r.status === "overdue"
          ? "overdue"
          : r.status === "verify"
            ? "verify"
            : "paid",
      date: r.status === "paid" ? (d.paidOn ?? "—") : "—",
      via: r.status === "paid" ? (d.method ?? d.bank) : "—",
    },
    { p: "Oktober 2026", st: "paid", date: "09 Okt 2026", via: d.bank },
    { p: "September 2026", st: "paid", date: "10 Sep 2026", via: "Tunai" },
    { p: "Agustus 2026", st: "late", date: "13 Agu 2026", via: d.bank },
    { p: "Juli 2026", st: "paid", date: "08 Jul 2026", via: d.bank },
  ]
  const badge: Record<string, [string, string]> = {
    paid: ["Lunas", "bg-[#10B981]/10 text-emerald-700"],
    late: ["Lunas Telat", "bg-[#F59E0B]/12 text-amber-700"],
    overdue: ["Nunggak", "bg-[#F43F5E]/10 text-rose-700"],
    verify: ["Verifikasi", "bg-[#F59E0B]/12 text-amber-700"],
  }
  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#E6E2D8] bg-white">
        <div className="flex items-center gap-2 border-b border-[#E6E2D8] px-4 py-3">
          <Receipt className="size-4 text-[#5C432C]" />
          <p className="text-[12.5px] font-semibold text-[#2B211A]">
            Riwayat Tagihan Sewa
          </p>
        </div>
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left text-[10.5px] uppercase tracking-wider text-slate-400">
              <th className="px-4 py-2 font-semibold">Periode</th>
              <th className="py-2 font-semibold">Nominal</th>
              <th className="py-2 font-semibold">Dibayar</th>
              <th className="py-2 font-semibold">Via</th>
              <th className="px-4 py-2 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E2D8]">
            {rows.map((x) => (
              <tr key={x.p}>
                <td className="px-4 py-2.5 font-medium text-slate-900">
                  {x.p}
                </td>
                <td className="py-2.5 tabular-nums text-slate-700">
                  {rupiah(r.price)}
                </td>
                <td className="py-2.5 text-slate-500">{x.date}</td>
                <td className="py-2.5 text-slate-500">{x.via}</td>
                <td className="px-4 py-2.5 text-right">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${badge[x.st][1]}`}
                  >
                    {badge[x.st][0]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-[#E6E2D8] bg-white">
        <div className="flex items-center gap-2 border-b border-[#E6E2D8] px-4 py-3">
          <ShieldCheck className="size-4 text-[#5C432C]" />
          <p className="text-[12.5px] font-semibold text-[#2B211A]">
            Buku Besar Deposit
          </p>
          <span className="ml-auto text-[12.5px] font-bold text-[#2B211A] tabular-nums">
            Saldo {rupiah(d.deposit)}
          </span>
        </div>
        <ul className="divide-y divide-[#E6E2D8]">
          <li className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-[#10B981]/10 text-[#10B981]">
              <ArrowDownLeft className="size-3.5" strokeWidth={2.4} />
            </span>
            <div className="flex-1">
              <p className="text-[12px] font-medium text-slate-900">
                Setoran deposit check-in
              </p>
              <p className="text-[11px] text-slate-500">
                {d.start} · {d.bank}
              </p>
            </div>
            <p className="text-[12px] font-semibold text-emerald-700 tabular-nums">
              +{rupiah(d.deposit)}
            </p>
          </li>
          <li className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-[#F6EFE6] text-[#5C432C]">
              <Lock className="size-3.5" strokeWidth={2.2} />
            </span>
            <div className="flex-1">
              <p className="text-[12px] font-medium text-slate-900">
                Dikunci di rekening escrow
              </p>
              <p className="text-[11px] text-slate-500">
                Tidak ada potongan · Siap direkonsiliasi
              </p>
            </div>
            <p className="text-[12px] font-semibold text-slate-500 tabular-nums">
              Rp0
            </p>
          </li>
        </ul>
      </section>
    </div>
  )
}
