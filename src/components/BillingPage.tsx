import {
  Zap,
  Search,
  ArrowRight,
  MessageCircle,
  FileDown,
  CheckCircle2,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Landmark,
  Banknote,
  CalendarClock,
  Link2,
  RotateCcw,
  X,
  Send,
  AlertTriangle,
  Receipt,
  Loader2,
  ArrowUpDown,
  Download,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { rupiah, fmtDate, PERIOD, type Room } from "@/lib/data"
import { useStore } from "@/store/store"
import { downloadCsv } from "@/lib/lib"

type Filter = "all" | "verify" | "paid" | "overdue"

// Receipt (230px) at max zoom still fits the inspector width without cropping.
const MAX_ZOOM = 1.5

const ORDER = { verify: 0, overdue: 1, paid: 2, vacant: 3 }

const firstName = (n = "") =>
  n.split(" ").find((w) => w.length > 2 && w !== "Muhammad") ?? n.split(" ")[0]

export default function BillingPage({
  rooms,
  onApprove,
  onReject,
  notify,
}: {
  rooms: Room[]
  onApprove: (no: number) => void
  onReject: (no: number) => void
  notify: (m: string) => void
}) {
  const invoices = useMemo(
    () =>
      rooms
        .filter((r) => r.status !== "vacant")
        .sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.no - b.no),
    [rooms],
  )
  const [filter, setFilter] = useState<Filter>("all")
  const [q, setQ] = useState("")
  const store = useStore()
  const firstVerify = rooms.find((r) => r.status === "verify")?.no ?? null
  const [selected, setSelected] = useState<number | null>(firstVerify)
  const [checked, setChecked] = useState<Set<number>>(
    new Set(firstVerify ? [firstVerify] : []),
  )
  const [generating, setGenerating] = useState(false)

  const count = (s: Filter) =>
    s === "all"
      ? invoices.length
      : invoices.filter((r) => r.status === s).length
  const shown = invoices.filter(
    (r) =>
      (filter === "all" || r.status === filter) &&
      (!q ||
        String(r.no).includes(q) ||
        r.tenant?.toLowerCase().includes(q.toLowerCase())),
  )
  const current = invoices.find((r) => r.no === selected) ?? null

  const total = invoices.reduce((s, r) => s + r.price, 0)
  const sum = (st: Room["status"]) =>
    invoices.filter((r) => r.status === st).reduce((s, r) => s + r.price, 0)

  const allChecked = shown.length > 0 && shown.every((r) => checked.has(r.no))
  const toggle = (no: number) =>
    setChecked((c) => {
      const n = new Set(c)
      if (n.has(no)) {
        n.delete(no)
      } else {
        n.add(no)
      }
      return n
    })

  const generate = () => {
    setGenerating(true)
    window.setTimeout(() => {
      setGenerating(false)
      store.generateNext()
    }, 1200)
  }

  const nextVerify = (no: number) =>
    invoices.find((r) => r.status === "verify" && r.no !== no)?.no ?? no

  const tabs: [Filter, string][] = [
    ["all", "Semua Tagihan"],
    ["verify", "Menunggu Verifikasi"],
    ["paid", "Lunas"],
    ["overdue", "Menunggak"],
  ]

  return (
    <div className="space-y-4">
      {/* Header & batch controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-medium text-slate-500">
            Tagihan & Mesin Invoice <span className="text-slate-300">/</span>{" "}
            Periode November 2026
          </p>
          <h1 className="mt-0.5 font-display text-[19px] sm:text-[21px] font-bold tracking-tight text-[#141413]">
            Manajemen Tagihan & Rekonsiliasi Kas Sewa
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              downloadCsv(
                `Ledger-Tagihan-${store.property.name.replace(/\s+/g, "-")}-November-2026.csv`,
                [
                  [
                    "No. Invoice",
                    "Kamar",
                    "Penghuni",
                    "Periode",
                    "Nominal",
                    "Status",
                    "Tgl Bayar",
                    "Metode",
                  ],
                  ...invoices.map((r) => {
                    const inv = store.invoices.find((i) => i.id === r.invoiceId)
                    return [
                      r.invoiceId ?? "",
                      r.no,
                      r.tenant ?? "",
                      PERIOD,
                      r.price,
                      r.status === "paid"
                        ? "Lunas"
                        : r.status === "verify"
                          ? "Menunggu Verifikasi"
                          : "Menunggak",
                      inv?.paidOn ? fmtDate(inv.paidOn) : "",
                      inv?.method ?? "",
                    ]
                  }),
                ],
              )
              notify("Ledger November 2026 diunduh (.csv, kompatibel Excel)")
            }}
            className="flex h-10 items-center gap-2 rounded-lg border border-[#E6E2D8] bg-white px-3.5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Download className="size-4 text-slate-500" /> Ekspor Ledger
          </button>
          <button
            onClick={generate}
            disabled={generating || store.nextGenerated}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#141413] px-4 text-[13px] font-semibold text-white hover:bg-stone-800 disabled:opacity-80"
          >
            {generating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Zap className="size-4 fill-white" strokeWidth={2} />
            )}
            {generating
              ? "Membuat Tagihan…"
              : store.nextGenerated
                ? `Tagihan Desember Terjadwal (${invoices.length})`
                : "Generate Tagihan Otomatis Bulan Depan"}
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E6E2D8] overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
        {[
          {
            label: "Total Tagihan November",
            v: rupiah(total),
            sub: `${invoices.length} invoice terbit`,
            c: "text-[#141413]",
            bar: "bg-[#141413]",
          },
          {
            label: "Kas Terverifikasi",
            v: rupiah(sum("paid")),
            sub: `${count("paid")} lunas · ${total ? Math.round((sum("paid") / total) * 100) : 0}% tertagih`,
            c: "text-emerald-700",
            bar: "bg-[#10B981]",
          },
          {
            label: "Menunggu Rekonsiliasi",
            v: rupiah(sum("verify")),
            sub: `${count("verify")} bukti transfer masuk`,
            c: "text-amber-700",
            bar: "bg-[#F59E0B]",
          },
          {
            label: "Piutang Menunggak",
            v: rupiah(sum("overdue")),
            sub: `${count("overdue")} penghuni lewat jatuh tempo`,
            c: "text-rose-600",
            bar: "bg-[#F43F5E]",
          },
        ].map((k, i) => (
          <div
            key={k.label}
            className={`relative px-4 py-3 ${
              i ? "border-l border-[#E6E2D8]" : ""
            }`}
          >
            <span
              className={`absolute left-0 top-3 h-8 w-[3px] rounded-r ${k.bar}`}
            />
            <p className="text-[11px] font-medium text-slate-500">{k.label}</p>
            <p
              className={`mt-0.5 font-display text-[18px] font-bold tabular-nums ${k.c}`}
            >
              {k.v}
            </p>
            <p className="text-[11px] text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] gap-4 xl:h-[calc(100vh-290px)] xl:min-h-[560px]">
        {/* LEFT: ledger */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex overflow-x-auto max-w-full rounded-lg bg-[#F3F0EA] p-0.5 scrollbar-none">
              {tabs.map(([k, label]) => {
                const on = filter === k
                const dot = {
                  all: "",
                  verify: "bg-[#F59E0B]",
                  paid: "bg-[#10B981]",
                  overdue: "bg-[#F43F5E]",
                }[k]
                return (
                  <button
                    key={k}
                    onClick={() => setFilter(k)}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                      on
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {dot && <span className={`size-1.5 rounded-full ${dot}`} />}
                    {label}{" "}
                    <span className="tabular-nums opacity-70">
                      ({count(k)})
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="relative w-[210px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari kamar / penghuni"
                className="h-8 w-full rounded-lg border border-[#E6E2D8] bg-[#FAF8F5] pl-8 pr-2 text-[12px] outline-none placeholder:text-slate-400 focus:border-[#141413] focus:bg-white"
              />
            </div>
          </div>

          {checked.size > 0 && (
            <div className="flex items-center gap-3 border-y border-[#DFD2BE] bg-[#F5EFE6] px-4 py-2 text-[12px]">
              <span className="font-semibold text-[#5C4728]">
                {checked.size} tagihan dipilih
              </span>
              <span className="h-4 w-px bg-[#DFD2BE]" />
              <button
                onClick={() =>
                  store.sendReminder([...checked], "Pengingat Tagihan Massal")
                }
                className="flex items-center gap-1 font-semibold text-[#8C6D3F] hover:text-[#141413]"
              >
                <Send className="size-3.5" /> Kirim WA Massal
              </button>
              <button
                onClick={() => {
                  const paid = invoices.filter(
                    (r) => checked.has(r.no) && r.status === "paid",
                  )
                  if (!paid.length)
                    return notify(
                      "Pilih tagihan berstatus Lunas untuk mengunduh kuitansi",
                    )
                  if (paid.length === 1)
                    return store.openModal({
                      type: "doc",
                      doc: { kind: "receipt", invoiceId: paid[0].invoiceId! },
                    })
                  downloadCsv(`Rekap-Kuitansi-November-2026.csv`, [
                    [
                      "No. Invoice",
                      "Kamar",
                      "Penghuni",
                      "Nominal",
                      "Tgl Bayar",
                    ],
                    ...paid.map((r) => [
                      r.invoiceId ?? "",
                      r.no,
                      r.tenant ?? "",
                      r.price,
                      r.paidOn ?? "",
                    ]),
                  ])
                  notify(`Rekap ${paid.length} kuitansi diunduh (.csv)`)
                }}
                className="flex items-center gap-1 font-semibold text-[#8C6D3F] hover:text-[#141413]"
              >
                <FileDown className="size-3.5" /> Unduh Kuitansi
              </button>
              <button
                onClick={() => setChecked(new Set())}
                className="ml-auto flex items-center gap-1 text-slate-500 hover:text-slate-800"
              >
                <X className="size-3.5" /> Batal pilih
              </button>
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <table className="w-full text-[12.5px]">
              <thead className="sticky top-0 z-10 bg-[#141413] text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-stone-200">
                <tr>
                  <th className="w-10 py-2.5 pl-4">
                    <Checkbox
                      on={allChecked}
                      dark
                      onChange={() =>
                        setChecked(
                          allChecked
                            ? new Set()
                            : new Set(shown.map((r) => r.no)),
                        )
                      }
                    />
                  </th>
                  <th className="py-2.5 pr-2">
                    <span className="inline-flex items-center gap-1">
                      No. Kamar <ArrowUpDown className="size-3 opacity-60" />
                    </span>
                  </th>
                  <th className="py-2.5 pr-2">Nama Penghuni</th>
                  <th className="py-2.5 pr-2">Periode Sewa</th>
                  <th className="py-2.5 pr-4 text-right">Nominal</th>
                  <th className="py-2.5 pr-2">Status Tagihan</th>
                  <th className="py-2.5 pr-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8]">
                {shown.map((r) => {
                  const sel = r.no === selected
                  return (
                    <tr
                      key={r.no}
                      onClick={() => setSelected(r.no)}
                      className={`cursor-pointer transition-colors ${
                        sel ? "bg-[#F5EFE6]" : "hover:bg-slate-50"
                      }`}
                    >
                      <td
                        className={`relative py-2.5 pl-4 ${
                          sel
                            ? "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#141413]"
                            : ""
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          on={checked.has(r.no)}
                          onChange={() => toggle(r.no)}
                        />
                      </td>
                      <td className="py-2.5 pr-2 font-semibold text-slate-900 tabular-nums">
                        Kamar {r.no}
                      </td>
                      <td className="py-2.5 pr-2">
                        <p className="font-medium text-slate-800">{r.tenant}</p>
                        <p className="text-[10.5px] text-slate-400">
                          {r.invoiceId}
                        </p>
                      </td>
                      <td className="py-2.5 pr-2 text-slate-600">
                        November 2026
                      </td>
                      <td className="py-2.5 pr-4 text-right font-semibold text-slate-900 tabular-nums">
                        {rupiah(r.price)}
                      </td>
                      <td className="py-2.5 pr-2">
                        <StatusBadge r={r} />
                      </td>
                      <td
                        className="py-2.5 pr-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {r.status === "verify" && (
                          <button
                            onClick={() => setSelected(r.no)}
                            className="inline-flex h-7 items-center gap-1 rounded-md bg-[#141413] px-2.5 text-[11.5px] font-semibold text-white hover:bg-stone-800"
                          >
                            Periksa Bukti <ArrowRight className="size-3.5" />
                          </button>
                        )}
                        {r.status === "overdue" && (
                          <button
                            onClick={() => store.sendReminder([r.no])}
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-[#F43F5E]/40 px-2.5 text-[11.5px] font-semibold text-rose-600 hover:bg-[#FFF1F2]"
                          >
                            <MessageCircle className="size-3.5" /> Kirim WA
                          </button>
                        )}
                        {r.status === "paid" && (
                          <button
                            onClick={() =>
                              store.openModal({
                                type: "doc",
                                doc: {
                                  kind: "receipt",
                                  invoiceId: r.invoiceId!,
                                },
                              })
                            }
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-[#E6E2D8] px-2.5 text-[11.5px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900"
                          >
                            <FileDown className="size-3.5" /> Kuitansi PDF
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {shown.length === 0 && (
              <p className="py-16 text-center text-[12.5px] text-slate-500">
                Tidak ada tagihan pada filter ini.
              </p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-[#E6E2D8] px-4 py-2.5 text-[11.5px] text-slate-500">
            <span>
              Menampilkan{" "}
              <b className="font-semibold text-slate-700">{shown.length}</b>{" "}
              dari {invoices.length} tagihan
            </span>
            <span className="tabular-nums">
              Subtotal:{" "}
              <b className="font-semibold text-slate-800">
                {rupiah(shown.reduce((s, r) => s + r.price, 0))}
              </b>
            </span>
          </div>
        </section>

        {/* RIGHT: inspector */}
        <Inspector
          room={current}
          onApprove={(no) => {
            onApprove(no)
            setSelected(nextVerify(no))
          }}
          onReject={(no) => {
            onReject(no)
            setSelected(nextVerify(no))
          }}
          notify={notify}
        />
      </div>
    </div>
  )
}

function Checkbox({
  on,
  onChange,
  dark,
}: {
  on: boolean
  onChange: () => void
  dark?: boolean
}) {
  return (
    <button
      role="checkbox"
      aria-checked={on}
      onClick={onChange}
      className={`flex size-4 items-center justify-center rounded-[4px] border transition-colors ${
        on
          ? "border-[#8C6D3F] bg-[#141413] text-white"
          : dark
            ? "border-stone-500/50 bg-transparent"
            : "border-slate-300 bg-white hover:border-[#8C6D3F]"
      }`}
    >
      {on && <Check className="size-3" strokeWidth={3.2} />}
    </button>
  )
}

function StatusBadge({ r }: { r: Room }) {
  const map = {
    verify: [
      "Menunggu Approval",
      "bg-[#F59E0B]/12 text-amber-700 ring-[#F59E0B]/30",
      "bg-[#F59E0B]",
    ],
    overdue: [
      `Nunggak (H+${r.overdueDays})`,
      "bg-[#F43F5E]/10 text-rose-700 ring-[#F43F5E]/25",
      "bg-[#F43F5E]",
    ],
    paid: [
      `Lunas (${r.paidOn})`,
      "bg-[#10B981]/10 text-emerald-700 ring-[#10B981]/25",
      "bg-[#10B981]",
    ],
    vacant: ["—", "", ""],
  }[r.status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${map[1]}`}
    >
      <span className={`size-1.5 rounded-full ${map[2]}`} />
      {map[0]}
    </span>
  )
}

function Inspector({
  room,
  onApprove,
  onReject,
}: {
  room: Room | null
  onApprove: (no: number) => void
  onReject: (no: number) => void
  notify?: (m: string) => void
}) {
  const [zoom, setZoom] = useState(1)
  const store = useStore()
  useEffect(() => setZoom(1), [room?.no])

  const shell =
    "flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#E6E2D8] bg-[#FAF8F5]"

  if (!room) {
    return (
      <aside className={`${shell} items-center justify-center p-8 text-center`}>
        <Receipt className="size-8 text-slate-300" />
        <p className="mt-3 text-[13px] font-semibold text-slate-700">
          Pilih baris tagihan
        </p>
        <p className="mt-1 text-[12px] text-slate-500">
          Detail mutasi transfer akan tampil di panel ini.
        </p>
      </aside>
    )
  }

  const inv = store.invoices.find((i) => i.id === room.invoiceId)
  const rc = inv?.proof ?? {
    uploaded: "Hari ini, 08:30 WIB",
    txTime: "08:27",
    ref: `26110${room.no}0001`,
  }
  const amount = room.price

  const header = (title: string, sub: React.ReactNode) => (
    <div className="bg-[#141413] px-4 py-3">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#C5A572]">
        {title}
      </p>
      <h2 className="mt-0.5 font-display text-[14px] font-bold leading-snug text-white">
        Kamar {room.no}{" "}
        <span className="font-medium text-stone-300">({room.tenant})</span>
      </h2>
      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
        {sub}
      </p>
    </div>
  )

  if (room.status !== "verify") {
    const paid = room.status === "paid"
    return (
      <aside className={shell}>
        {header(
          paid ? "Kuitansi Lunas" : "Tagihan Menunggak",
          paid
            ? `Diverifikasi ${room.paidOn} 2026 · Rekonsiliasi selesai`
            : `Lewat jatuh tempo ${room.overdueDays} hari · Belum ada bukti transfer`,
        )}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          <div className="rounded-xl border border-[#E6E2D8] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-500">
                {room.invoiceId}
              </p>
              <StatusBadge r={room} />
            </div>
            <p className="mt-2 font-display text-[24px] font-bold text-[#141413] tabular-nums">
              {rupiah(room.price)}
            </p>
            <p className="text-[11.5px] text-slate-500">
              Sewa Kamar {room.no} ({room.type}) · November 2026
            </p>
            <dl className="mt-3 space-y-1.5 border-t border-dashed border-[#E6E2D8] pt-3 text-[12px]">
              {[
                ["Penghuni", room.tenant],
                ["Jatuh tempo", "10 Nov 2026"],
                ["Metode", paid ? (inv?.method ?? "Transfer") : "—"],
                ["Kuitansi", paid ? "Terbit otomatis" : "Belum terbit"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-slate-500">{k}</dt>
                  <dd className="font-medium text-slate-800">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {!paid && (
            <div className="flex gap-2.5 rounded-lg border-l-[3px] border-[#F43F5E] bg-[#FFF1F2] px-3 py-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#F43F5E]" />
              <p className="text-[12px] leading-snug text-rose-900">
                Pengingat H+1 sudah terkirim otomatis. Kirim ulang atau catat
                pembayaran tunai jika penghuni membayar langsung.
              </p>
            </div>
          )}
        </div>
        <div className="border-t border-[#E6E2D8] bg-white p-3">
          {paid ? (
            <button
              onClick={() =>
                store.openModal({
                  type: "doc",
                  doc: { kind: "receipt", invoiceId: room.invoiceId! },
                })
              }
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#E6E2D8] text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileDown className="size-4" /> Unduh Kuitansi PDF
            </button>
          ) : (
            <button
              onClick={() => store.sendReminder([room.no])}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#141413] text-[12.5px] font-semibold text-white hover:bg-stone-800"
            >
              <Send className="size-4" /> Kirim Ulang Tagihan via WhatsApp
            </button>
          )}
        </div>
      </aside>
    )
  }

  const checks = [
    {
      icon: Banknote,
      title: "Nominal Transfer Cocok",
      v: `${rupiah(amount)} (Sesuai tarif sewa)`,
    },
    {
      icon: Landmark,
      title: "Rekening Tujuan Cocok",
      v: "BCA a/n Muhamad Maulana Rizki",
    },
    {
      icon: CalendarClock,
      title: "Tanggal & Jam Transaksi",
      v: `Valid (${rc.txTime} WIB)`,
    },
  ]

  return (
    <aside className={shell}>
      {header(
        "Verifikasi Mutasi Transfer",
        <>
          <Link2 className="size-3" /> Diunggah oleh penyewa via link WhatsApp{" "}
          <span className="text-[#C5A572]">•</span> {rc.uploaded}
        </>,
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {/* Receipt preview */}
        <div className="overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] px-3 py-1.5">
            <p className="text-[11px] font-medium text-slate-500">
              bukti_transfer_{room.no}.jpg · 284 KB
            </p>
            <div className="flex items-center gap-0.5">
              <IconBtn
                label="Perkecil"
                onClick={() =>
                  setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))
                }
              >
                <ZoomOut className="size-3.5" />
              </IconBtn>
              <span className="w-9 text-center text-[10.5px] font-semibold text-slate-600 tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <IconBtn
                label="Perbesar"
                onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.25))}
              >
                <ZoomIn className="size-3.5" />
              </IconBtn>
              <IconBtn label="Reset" onClick={() => setZoom(1)}>
                <RotateCcw className="size-3.5" />
              </IconBtn>
            </div>
          </div>
          {/* Box grows with the receipt (CSS zoom affects layout), so it never scrolls internally. */}
          <div
            className={`relative flex justify-center overflow-hidden bg-[#F3F0EA] p-3 ${
              zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setZoom((z) => (z > 1 ? 1 : MAX_ZOOM))}
          >
            <div style={{ zoom }} className="shrink-0">
              <BcaReceipt
                amount={amount}
                berita={`Sewa Kmr ${room.no} ${firstName(room.tenant)} Nov`}
                time={rc.txTime}
                refNo={rc.ref}
              />
            </div>
            {zoom === 1 && (
              <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-[#141413]/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                <Maximize2 className="size-3" /> Klik untuk zoom
              </span>
            )}
          </div>
        </div>

        {/* Auto-match */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Auto-Match Sistem
            </p>
            <span className="rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              3/3 Cocok
            </span>
          </div>
          <div className="space-y-1.5">
            {checks.map(({ icon: Icon, title, v }) => (
              <div
                key={title}
                className="flex items-center gap-2.5 rounded-lg border border-[#E6E2D8] bg-white px-3 py-2"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-white">
                  <Check className="size-3" strokeWidth={3.2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-slate-900">
                    {title}
                  </p>
                  <p className="truncate text-[11.5px] text-slate-500">{v}</p>
                </div>
                <Icon className="size-4 text-slate-300" strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky actions */}
      <div className="flex gap-2 border-t border-[#E6E2D8] bg-white p-3">
        <button
          onClick={() => onReject(room.no)}
          className="flex min-h-11 basis-[40%] items-center justify-center rounded-lg border border-[#F43F5E] px-2 text-center text-[11.5px] font-semibold leading-tight text-[#E11D48] hover:bg-[#FFF1F2]"
        >
          Tolak Bukti (Minta Kirim Ulang via WA)
        </button>
        <button
          onClick={() => onApprove(room.no)}
          className="flex min-h-11 basis-[60%] items-center justify-center gap-1.5 rounded-lg bg-[#10B981] px-2 text-[12.5px] font-semibold text-white hover:bg-[#059669]"
        >
          <CheckCircle2 className="size-4" strokeWidth={2.4} /> Setujui &
          Terbitkan Kuitansi Lunas
        </button>
      </div>
    </aside>
  )
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex size-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800"
    >
      {children}
    </button>
  )
}

function BcaReceipt({
  amount,
  berita,
  time,
  refNo,
}: {
  amount: number
  berita: string
  time: string
  refNo: string
}) {
  const rows: [string, string][] = [
    ["Transfer Ke", "1234567890"],
    ["Nama Penerima", "SUPERKOST MAULANA"],
    ["Berita", berita],
    ["Tanggal", `05/11/2026 ${time}:18`],
    ["No. Referensi", refNo],
  ]
  return (
    <div className="w-[230px] overflow-hidden rounded-[14px] border border-slate-300/70 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#0060AF] px-3 py-2">
        <span className="text-[11px] font-extrabold italic tracking-tight text-white">
          BCA mobile
        </span>
        <span className="text-[8.5px] font-medium text-white/80">
          m-Transfer
        </span>
      </div>
      <div className="px-3 pt-2.5 text-center">
        <span className="mx-auto flex size-7 items-center justify-center rounded-full bg-[#10B981]/12">
          <CheckCircle2 className="size-4 text-[#10B981]" strokeWidth={2.4} />
        </span>
        <p className="mt-1 text-[10px] font-bold tracking-[0.15em] text-[#10B981]">
          BERHASIL
        </p>
        <p className="mt-1 text-[8.5px] text-slate-500">Nominal</p>
        <p className="text-[15px] font-bold text-slate-900 tabular-nums">
          {rupiah(amount)},00
        </p>
      </div>
      <dl className="mx-3 mt-2 space-y-1 border-t border-dashed border-slate-200 py-2">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 text-[8.5px]">
            <dt className="text-slate-500">{k}</dt>
            <dd className="truncate text-right font-semibold text-slate-800">
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <div className="bg-slate-50 px-3 py-1.5 text-center text-[7.5px] text-slate-400">
        Simpan bukti ini sebagai referensi transaksi
      </div>
    </div>
  )
}
