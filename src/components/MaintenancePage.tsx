import {
  Plus,
  AirVent,
  AlertTriangle,
  Wallet,
  Wrench,
  CalendarCheck,
  Star,
  MessageCircle,
  BookOpen,
  Check,
  Droplets,
  BadgeCheck,
  ClipboardList,
  ShoppingCart,
} from "lucide-react"
import { useMemo, useState, type ReactNode } from "react"
import {
  rupiah,
  since,
  acHealth,
  AC_CYCLE,
  TODAY,
  type AcUnit,
  type AcHealth,
  type Ticket,
} from "@/lib/data"
import { useStore } from "@/store/store"
import { VENDORS, CATALOG } from "@/lib/vendors"
import { waLink } from "@/lib/lib"
import { ModalShell, Btn, PageHeader, Tabs } from "./ui"

const LONG = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Juni",
  "Juli",
  "Agu",
  "Sept",
  "Okt",
  "Nov",
  "Des",
]
const fmt = (s: string) => {
  const [y, m, d] = s.split("-").map(Number)
  return `${d} ${LONG[m - 1]} ${y}`
}
const ago = (s: string) => {
  const { m, d } = since(s)
  if (m === 0) return d === 0 ? "Hari ini" : `${d} Hari lalu`
  return m >= AC_CYCLE ? `${m} Bulan ${d} Hari lalu` : `${m} Bulan lalu`
}

export default function MaintenancePage() {
  const s = useStore()
  const [filter, setFilter] = useState<"all" | "need" | "safe">("all")
  const [catalog, setCatalog] = useState(false)

  const openTickets = s.tickets.filter((t) => t.status === "open")
  const scheduled = useMemo(
    () =>
      new Map(
        openTickets
          .filter((t) => t.category === "AC" && t.room)
          .map((t) => [t.room!, t]),
      ),
    [openTickets],
  )
  const withHealth = s.units.map((u) => ({ u, h: acHealth(u.last) }))
  const need = withHealth.filter((x) => x.h === "overdue").length
  const normal = withHealth.filter((x) => x.h === "healthy").length
  const shown = withHealth.filter(({ h }) =>
    filter === "all"
      ? true
      : filter === "need"
        ? h === "overdue"
        : h !== "overdue",
  )
  const acCosts = s.expenses.filter((e) => e.category === "Servis AC")
  const acTotal = acCosts.reduce((a, e) => a + e.amount, 0)
  const otherOpen = openTickets.filter((t) => t.category !== "AC")

  return (
    <div className="space-y-4">
      <PageHeader
        crumb="Servis Fasilitas & Vendor / Jadwal Pemeliharaan Preventif"
        title="Pemeliharaan Preventif Aset & Jadwal Servis AC"
        actions={
          <button
            onClick={() => s.openModal({ type: "ticket" })}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#4F46E5] px-4 text-[13px] font-semibold text-white hover:bg-[#4338CA]"
          >
            <Plus className="size-4" strokeWidth={2.4} /> Buat Tiket Servis Baru
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <Stat
          icon={<AirVent className="size-4" />}
          label="Total Aset Pendingin"
          value={`${s.units.length} Unit AC Terdaftar`}
        >
          <Tag cls="bg-[#10B981]/10 text-emerald-700 ring-[#10B981]/25">
            <span className="size-1.5 rounded-full bg-[#10B981]" /> {normal}{" "}
            Berfungsi Normal
          </Tag>
          <span className="text-[11.5px] text-slate-500">
            · {s.units.length - normal - need} mendekati jadwal
          </span>
        </Stat>
        <Stat
          icon={<AlertTriangle className="size-4" />}
          label="Prioritas Servis"
          value={`${need} Unit Perlu Servis Segera`}
          valueCls={need ? "text-[#E11D48]" : "text-[#1E1B4B]"}
          danger={need > 0}
        >
          {need > 0 ? (
            <Tag cls="bg-[#F43F5E]/10 text-rose-700 ring-[#F43F5E]/25">
              <AlertTriangle className="size-3" /> Melebihi Siklus 5 Bulan
            </Tag>
          ) : (
            <Tag cls="bg-[#10B981]/10 text-emerald-700 ring-[#10B981]/25">
              Semua dalam siklus
            </Tag>
          )}
          {openTickets.length > 0 && (
            <span className="text-[11.5px] text-slate-500">
              · {openTickets.length} tiket berjalan
            </span>
          )}
        </Stat>
        <Stat
          icon={<Wallet className="size-4" />}
          label="Biaya Servis Bulan Ini"
          value={rupiah(acTotal)}
        >
          <Tag cls="bg-[#F5F3FF] text-[#4F46E5] ring-[#C7D2FE]">
            <Droplets className="size-3" /> {acCosts.length} Unit Dicuci
          </Tag>
          <button
            onClick={() => s.navigate("finance", "kas")}
            className="text-[11.5px] font-medium text-[#4F46E5] hover:underline"
          >
            · Lihat di Buku Kas
          </button>
        </Stat>
      </div>

      {otherOpen.length > 0 && (
        <section className="rounded-xl border border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-4 py-3">
            <ClipboardList className="size-4 text-[#4F46E5]" />
            <h2 className="font-display text-[14px] font-bold text-[#1E1B4B]">
              Tiket Fasilitas Berjalan
            </h2>
            <span className="rounded-full bg-[#F59E0B]/12 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700">
              {otherOpen.length} Terbuka
            </span>
          </div>
          <ul className="divide-y divide-[#E2E8F0]">
            {otherOpen.map((t) => (
              <TicketRow
                key={t.id}
                t={t}
                onDone={() => s.completeTicket(t.id)}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-[#E2E8F0] bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] px-4 py-3">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-4 text-[#4F46E5]" />
            <h2 className="font-display text-[14px] font-bold text-[#1E1B4B]">
              Status Siklus Cuci AC Berkala
            </h2>
            <span className="text-[12px] text-slate-500">
              (Rekomendasi 5 Bulan)
            </span>
          </div>
          <Tabs
            value={filter}
            onChange={setFilter}
            items={[
              { k: "all", label: "Semua Unit", n: s.units.length },
              {
                k: "need",
                label: "Perlu Servis",
                n: need,
                dot: "bg-[#F43F5E]",
              },
              {
                k: "safe",
                label: "Aman",
                n: s.units.length - need,
                dot: "bg-[#10B981]",
              },
            ]}
          />
        </div>
        <div className="grid grid-cols-6 gap-2 p-4">
          {shown.map(({ u, h }) => (
            <UnitCard
              key={u.room}
              u={u}
              h={h}
              ticket={scheduled.get(u.room)}
              onCall={() =>
                s.openModal({ type: "ticket", roomNo: u.room, category: "AC" })
              }
              onComplete={(id) => s.completeTicket(id)}
            />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="pb-10 text-center text-[12.5px] text-slate-500">
            Tidak ada unit pada filter ini.
          </p>
        )}
        <div className="flex items-center gap-4 border-t border-[#E2E8F0] px-4 py-2.5 text-[11px] text-slate-500">
          {[
            ["bg-[#F43F5E]", "Wajib Servis (≥ 5 bulan)"],
            ["bg-[#F59E0B]", "Jadwal Bulan Depan (4–5 bulan)"],
            ["bg-[#10B981]", "Kondisi Prima (< 4 bulan)"],
            ["bg-[#4F46E5]", "Teknisi Dijadwalkan"],
          ].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-sm ${c}`} /> {l}
            </span>
          ))}
          <span className="ml-auto">Acuan hari ini: {fmt(TODAY)}</span>
        </div>
      </section>

      <section>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="font-display text-[14px] font-bold text-[#1E1B4B]">
            Direktori Teknisi & Toko Langganan Kost
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {VENDORS.map((v) => {
            const Icon = v.icon
            const CIcon = v.contact.icon
            return (
              <div
                key={v.name}
                className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F3FF] text-[#4F46E5] ring-1 ring-[#C7D2FE]">
                    <Icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 text-[13px] font-bold text-[#1E1B4B]">
                      {v.name}{" "}
                      <BadgeCheck className="size-3.5 text-[#4F46E5]" />
                    </p>
                    <p className="text-[11.5px] text-slate-500">{v.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center justify-end gap-0.5 text-[12.5px] font-bold text-slate-900">
                      <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />{" "}
                      {v.rating}
                      <span className="font-normal text-slate-400">/5</span>
                    </p>
                    <p className="text-[10.5px] text-slate-400">
                      {v.jobs +
                        s.tickets.filter(
                          (t) => t.vendor === v.name && t.status === "done",
                        ).length}{" "}
                      pekerjaan
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {v.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-[#F8FAFC] px-1.5 py-0.5 text-[10.5px] font-medium text-slate-600 ring-1 ring-inset ring-[#E2E8F0]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-[#E2E8F0] pt-3 text-[12px]">
                  <CIcon className="size-3.5 text-slate-400" />
                  <span className="text-slate-500">{v.contact.label}:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {v.contact.value}
                  </span>
                </div>
                {v.action === "wa" ? (
                  <a
                    href={waLink(
                      v.phone,
                      `Halo ${
                        v.contact.label === "Kontak" ? v.name : v.contact.label
                      }, saya dari ${s.property.name}. `,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#10B981] text-[12.5px] font-semibold text-white hover:bg-[#059669]"
                  >
                    <MessageCircle className="size-4" /> Hubungi WhatsApp
                  </a>
                ) : (
                  <button
                    onClick={() => setCatalog(true)}
                    className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <BookOpen className="size-4 text-slate-500" /> Lihat Katalog
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {catalog && <CatalogModal onClose={() => setCatalog(false)} />}
    </div>
  )
}

function CatalogModal({ onClose }: { onClose: () => void }) {
  const s = useStore()
  const [qty, setQty] = useState<Record<string, number>>({})
  const total = CATALOG.reduce((a, [n, , p]) => a + (qty[n] ?? 0) * p, 0)
  return (
    <ModalShell
      title="Katalog Toko Listrik Terang Jaya"
      subtitle="Jl. Dharmawangsa 42 · harga langganan kost"
      icon={<BookOpen className="size-[18px]" />}
      onClose={onClose}
      width={560}
      footer={
        <>
          <p className="mr-auto text-[12px] text-slate-500">
            Total:{" "}
            <b className="text-slate-900 tabular-nums">{rupiah(total)}</b>
          </p>
          <Btn variant="secondary" onClick={onClose}>
            Tutup
          </Btn>
          <Btn
            disabled={!total}
            onClick={() => {
              const items = CATALOG.filter(([n]) => qty[n])
                .map(([n]) => `${qty[n]}× ${n}`)
                .join(", ")
              s.addExpense({
                date: TODAY,
                category: "Perbaikan",
                desc: `Belanja Terang Jaya: ${items}`,
                amount: total,
                source: "Manual",
              })
              s.notify(
                `Pembelian ${rupiah(total)} dicatat ke Buku Kas Pengeluaran`,
              )
              onClose()
            }}
          >
            <ShoppingCart className="size-4" /> Beli & Catat ke Buku Kas
          </Btn>
        </>
      }
    >
      <table className="w-full text-[12.5px]">
        <thead className="bg-[#F8FAFC] text-left text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-2">Barang</th>
            <th className="py-2 text-right">Harga</th>
            <th className="w-[120px] px-5 py-2 text-right">Jumlah</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {CATALOG.map(([n, unit, p]) => (
            <tr key={n}>
              <td className="px-5 py-2.5 font-medium text-slate-800">{n}</td>
              <td className="py-2.5 text-right text-slate-600 tabular-nums">
                {rupiah(p)} <span className="text-slate-400">/ {unit}</span>
              </td>
              <td className="px-5 py-2.5 text-right">
                <input
                  type="number"
                  min={0}
                  value={qty[n] ?? 0}
                  onChange={(e) =>
                    setQty((q) => ({
                      ...q,
                      [n]: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="h-8 w-16 rounded-md border border-[#E2E8F0] px-2 text-right tabular-nums outline-none focus:border-[#6366F1]"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalShell>
  )
}

function TicketRow({ t, onDone }: { t: Ticket; onDone: () => void }) {
  return (
    <li className="flex items-center gap-3 px-4 py-2.5">
      <span className="flex size-8 items-center justify-center rounded-md bg-[#F59E0B]/12 text-amber-600">
        <Wrench className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold text-slate-900">
          {t.job}{" "}
          <span className="font-normal text-slate-500">
            · {t.room ? `Kamar ${t.room}` : "Area Umum"}
          </span>
        </p>
        <p className="text-[11px] text-slate-500">
          {t.id} · {t.category} · {t.vendor} · jadwal {fmt(t.date)} · estimasi{" "}
          {rupiah(t.cost)}
        </p>
      </div>
      <Btn variant="success" onClick={onDone} className="h-8">
        <Check className="size-3.5" strokeWidth={3} /> Tandai Selesai
      </Btn>
    </li>
  )
}

function Stat({
  icon,
  label,
  value,
  valueCls = "text-[#1E1B4B]",
  danger,
  children,
}: {
  icon: ReactNode
  label: string
  value: string
  valueCls?: string
  danger?: boolean
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="flex items-center gap-2">
        <span
          className={`flex size-6 items-center justify-center rounded-md ${
            danger
              ? "bg-[#F43F5E]/10 text-[#F43F5E]"
              : "bg-[#F5F3FF] text-[#4F46E5]"
          }`}
        >
          {icon}
        </span>
        <p className="text-[12px] font-medium text-slate-500">{label}</p>
      </div>
      <p
        className={`mt-2.5 font-display text-[21px] font-bold tracking-tight tabular-nums ${valueCls}`}
      >
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">{children}</div>
    </div>
  )
}

const Tag = ({ cls, children }: { cls: string; children: ReactNode }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${cls}`}
  >
    {children}
  </span>
)

function UnitCard({
  u,
  h,
  ticket,
  onCall,
  onComplete,
}: {
  u: AcUnit
  h: AcHealth
  ticket?: Ticket
  onCall: () => void
  onComplete: (id: string) => void
}) {
  const { total } = since(u.last)
  const pct = Math.min(100, (total / AC_CYCLE) * 100)
  const st = {
    overdue: {
      border: "border-[#F43F5E]",
      bar: "bg-[#F43F5E]",
      tag: "bg-[#F43F5E]/10 text-rose-700",
      label: "Wajib Servis",
    },
    upcoming: {
      border: "border-[#F59E0B]",
      bar: "bg-[#F59E0B]",
      tag: "bg-[#F59E0B]/12 text-amber-700",
      label: "Jadwal Bulan Depan",
    },
    healthy: {
      border: "border-[#E2E8F0]",
      bar: "bg-[#10B981]",
      tag: "bg-[#10B981]/10 text-emerald-700",
      label: "Kondisi Prima",
    },
  }[h]

  return (
    <div
      className={`flex flex-col rounded-[10px] border bg-white p-2.5 ${
        ticket ? "border-[#C7D2FE]" : st.border
      } ${h === "overdue" && !ticket ? "ring-2 ring-[#F43F5E]/10" : ""}`}
    >
      <div className="flex items-center justify-between gap-1">
        <p className="text-[12px] font-semibold text-slate-900">
          Kamar {u.room}
        </p>
        <span
          className={`rounded px-1.5 py-0.5 text-[9.5px] font-semibold ${
            ticket ? "bg-[#F5F3FF] text-[#4F46E5]" : st.tag
          }`}
        >
          {ticket ? "Dijadwalkan" : st.label}
        </span>
      </div>
      <p className="text-[10.5px] text-slate-500">
        ({u.brand} {u.pk})
      </p>
      <p className="mt-1.5 text-[10.5px] leading-snug text-slate-600">
        Terakhir Servis:{" "}
        <span className="font-medium text-slate-800">{fmt(u.last)}</span>
      </p>
      <p
        className={`text-[10.5px] ${
          h === "overdue" ? "font-semibold text-rose-600" : "text-slate-400"
        }`}
      >
        ({ago(u.last)})
      </p>
      <div
        className="mt-2 h-1 overflow-hidden rounded-full bg-[#F1F5F9]"
        title={`${Math.round(pct)}% dari siklus 5 bulan`}
      >
        <div
          className={`h-full rounded-full ${st.bar}`}
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>
      {ticket ? (
        <div className="mt-2">
          <p className="truncate text-[10px] text-[#4F46E5]">
            {ticket.vendor} · {fmt(ticket.date)}
          </p>
          <button
            onClick={() => onComplete(ticket.id)}
            className="mt-1 flex h-6 w-full items-center justify-center gap-1 rounded-md bg-[#10B981] text-[10.5px] font-semibold text-white hover:bg-[#059669]"
          >
            <Check className="size-3" strokeWidth={3} /> Tandai Selesai
          </button>
        </div>
      ) : (
        h === "overdue" && (
          <button
            onClick={onCall}
            className="mt-2 flex h-6 w-full items-center justify-center gap-1 rounded-md bg-[#F43F5E] text-[10.5px] font-semibold text-white hover:bg-[#E11D48]"
          >
            <Wrench className="size-3" strokeWidth={2.4} /> Panggil Teknisi
          </button>
        )
      )}
    </div>
  )
}
