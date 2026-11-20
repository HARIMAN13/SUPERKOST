import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Phone,
  HeartHandshake,
  Download,
} from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import { rupiah, fmtDate, monthsBetween } from "@/lib/data"
import { downloadCsv } from "@/lib/lib"
import { PageHeader, Tabs, Pill, tone, Avatar, Btn } from "../ui"

export default function TenantsPage() {
  const s = useStore()
  const [q, setQ] = useState("")
  const [tab, setTab] = useState<"active" | "overdue" | "past">("active")

  const active = s.rooms.filter((r) => r.tenantId)
  const past = s.tenants.filter((t) => !t.active)
  const term = q.trim().toLowerCase()
  const match = (name: string, no: number | null, phone: string) =>
    !term ||
    name.toLowerCase().includes(term) ||
    String(no ?? "").includes(term) ||
    phone.replace(/\D/g, "").includes(term.replace(/\D/g, "") || "#")
  const rows = active
    .filter((r) => (tab === "overdue" ? r.status === "overdue" : true))
    .map((r) => ({
      r,
      t: s.tenants.find((t) => t.id === r.tenantId)!,
      dep: s.deposits.find(
        (d) => d.tenantId === r.tenantId && d.status !== "refunded",
      ),
    }))
    .filter(({ r, t }) => t && match(t.name, r.no, t.phone))

  const status = {
    paid: ["Lunas", tone.green],
    overdue: ["Nunggak", tone.red],
    verify: ["Verifikasi", tone.amber],
    vacant: ["-", tone.slate],
  } as const

  return (
    <div className="space-y-4">
      <PageHeader
        crumb="Data Penghuni & Kontrak"
        title="Direktori Penghuni & Kontrak Aktif"
        actions={
          <>
            <div className="relative w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nama, nomor kamar, atau no. HP"
                className="h-10 w-full rounded-lg border border-[#E6E2D8] bg-white pl-9 pr-3 text-[12.5px] outline-none placeholder:text-slate-400 focus:border-[#141413] focus:ring-3 focus:ring-[#141413]/10"
              />
            </div>
            <Btn
              variant="secondary"
              className="h-10"
              onClick={() =>
                downloadCsv(
                  `Direktori-Penghuni-${s.property.name.replace(/\s+/g, "-")}.csv`,
                  [
                    [
                      "Kamar",
                      "Nama",
                      "WhatsApp",
                      "Kontak Darurat",
                      "Mulai Sewa",
                      "Masa Sewa (bln)",
                      "Deposit",
                      "Status",
                    ],
                    ...rows.map(({ r, t, dep }) => [
                      r.no,
                      t.name,
                      t.phone,
                      `${t.emergency.name} (${t.emergency.rel}) ${t.emergency.phone}`,
                      fmtDate(t.start),
                      monthsBetween(t.start),
                      dep?.amount ?? 0,
                      status[r.status][0],
                    ]),
                  ],
                )
              }
            >
              <Download className="size-4 text-slate-500" /> Ekspor
            </Btn>
            <button
              onClick={() => s.openModal({ type: "checkIn" })}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#141413] px-4 text-[13px] font-semibold text-white hover:bg-stone-800"
            >
              <UserPlus className="size-4" /> Check-In Penghuni Baru
            </button>
          </>
        }
      />

      <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
        {[
          [
            "Penghuni Aktif",
            `${active.length} orang`,
            `${s.stats.vacant} kamar masih kosong`,
          ],
          [
            "Rata-rata Masa Sewa",
            `${
              active.length
                ? (
                    active.reduce(
                      (a, r) =>
                        a +
                        monthsBetween(
                          s.tenants.find((t) => t.id === r.tenantId)!.start,
                        ),
                      0,
                    ) / active.length
                  ).toFixed(1)
                : 0
            } bulan`,
            "dihitung dari tanggal check-in",
          ],
          [
            "Pembayaran Bermasalah",
            `${s.stats.overdue.length} penghuni`,
            `${s.stats.verify.length} menunggu verifikasi`,
          ],
          [
            "Kontrak Selesai",
            `${past.length} penghuni`,
            "deposit sudah direkonsiliasi",
          ],
        ].map(([l, v, sub], i) => (
          <div
            key={l}
            className={`px-4 py-3 ${i ? "border-l border-[#E6E2D8]" : ""}`}
          >
            <p className="text-[11px] font-medium text-slate-500">{l}</p>
            <p className="mt-0.5 font-display text-[18px] font-bold text-[#141413]">
              {v}
            </p>
            <p className="text-[11px] text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
        <div className="flex items-center justify-between border-b border-[#E6E2D8] px-4 py-3">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { k: "active", label: "Kontrak Aktif", n: active.length },
              {
                k: "overdue",
                label: "Menunggak",
                n: s.stats.overdue.length,
                dot: "bg-[#F43F5E]",
              },
              { k: "past", label: "Riwayat Keluar", n: past.length },
            ]}
          />
          <p className="text-[11.5px] text-slate-500">
            Klik baris untuk membuka profil 360° penghuni
          </p>
        </div>

        {tab === "past" ? (
          <table className="w-full text-[12.5px]">
            <thead className="bg-[#141413] text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-stone-200">
              <tr>
                <th className="px-4 py-2.5">Nama</th>
                <th className="py-2.5">Masa Sewa</th>
                <th className="py-2.5">Tgl Keluar</th>
                <th className="px-4 py-2.5 text-right">Deposit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2D8]">
              {past
                .filter((t) => match(t.name, null, t.phone))
                .map((t) => {
                  const dep = s.deposits.find((d) => d.tenantId === t.id)
                  return (
                    <tr key={t.id}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={t.name} />
                          <span className="font-semibold text-slate-800">
                            {t.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-600">
                        {fmtDate(t.start)} –{" "}
                        {t.endDate ? fmtDate(t.endDate) : "-"}
                      </td>
                      <td className="py-2.5 text-slate-600">
                        {t.endDate ? fmtDate(t.endDate) : "-"}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {dep && (
                          <button
                            onClick={() =>
                              s.openModal({
                                type: "doc",
                                doc: { kind: "clearance", depositId: dep.id },
                              })
                            }
                            className="text-[12px] font-semibold text-[#8C6D3F] hover:underline"
                          >
                            Refund {rupiah(dep.refund ?? 0)} · Berita Acara
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        ) : (
          <div className="max-h-[calc(100vh-360px)] min-h-[360px] overflow-y-auto">
            <table className="w-full text-[12.5px]">
              <thead className="sticky top-0 z-10 bg-[#141413] text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-stone-200">
                <tr>
                  <th className="px-4 py-2.5">Kamar</th>
                  <th className="py-2.5 pr-3">Nama Penghuni</th>
                  <th className="py-2.5 pr-3">No. WhatsApp</th>
                  <th className="py-2.5 pr-3">Kontak Darurat</th>
                  <th className="py-2.5 pr-3">Masa Sewa</th>
                  <th className="py-2.5 pr-3 text-right">Uang Deposit</th>
                  <th className="py-2.5 pr-3">Status Bayar</th>
                  <th className="px-4 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8]">
                {rows.map(({ r, t, dep }) => (
                  <tr
                    key={r.no}
                    onClick={() => s.openDrawer(r.no)}
                    className="cursor-pointer hover:bg-[#F5EFE6]/60"
                  >
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-slate-900 tabular-nums">
                        {r.no}
                      </p>
                      <p className="text-[10.5px] text-slate-400">{r.type}</p>
                    </td>
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={t.name} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">
                            {t.name}
                          </p>
                          <p className="text-[10.5px] text-slate-400">
                            Jatuh tempo tgl {t.dueDay}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-700 tabular-nums">
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3 text-[#10B981]" /> {t.phone}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <p className="flex items-center gap-1.5 text-slate-700">
                        <HeartHandshake className="size-3 text-slate-400" />{" "}
                        {t.emergency.name}
                      </p>
                      <p className="text-[10.5px] text-slate-400">
                        {t.emergency.rel} · {t.emergency.phone}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3">
                      <p className="font-medium text-slate-800">
                        {monthsBetween(t.start)} bulan
                      </p>
                      <p className="text-[10.5px] text-slate-400">
                        sejak {fmtDate(t.start)}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3 text-right">
                      <p className="font-semibold text-slate-900 tabular-nums">
                        {rupiah(dep?.amount ?? 0)}
                      </p>
                      <p
                        className={`text-[10.5px] ${
                          dep?.status === "dispute"
                            ? "text-rose-600"
                            : "text-slate-400"
                        }`}
                      >
                        {dep?.status === "dispute"
                          ? "Sengketa"
                          : "Terkunci aman"}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3">
                      <Pill cls={status[r.status][1]}>
                        {status[r.status][0]}
                        {r.status === "overdue" && ` H+${r.overdueDays}`}
                      </Pill>
                    </td>
                    <td
                      className="px-4 py-2.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => s.openDrawer(r.no)}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-[#E6E2D8] px-2 text-[11.5px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900"
                        >
                          <Eye className="size-3.5" /> Detail
                        </button>
                        <button
                          onClick={() =>
                            s.openModal({ type: "checkIn", tenantId: t.id })
                          }
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-[#E6E2D8] px-2 text-[11.5px] font-semibold text-slate-600 hover:bg-white hover:text-slate-900"
                        >
                          <Pencil className="size-3.5" /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="py-14 text-center text-[12.5px] text-slate-500">
                Tidak ada penghuni yang cocok.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
