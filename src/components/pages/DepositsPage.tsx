import {
  Vault,
  ShieldAlert,
  ArrowUpRight,
  Scissors,
  FileText,
  Lock,
  Scale,
  Download,
} from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import { rupiah, fmtDate } from "@/lib/data"
import { downloadCsv } from "@/lib/lib"
import { PageHeader, Tabs, Pill, tone, Btn } from "../ui"

export default function DepositsPage() {
  const s = useStore()
  const [tab, setTab] = useState<"all" | "locked" | "dispute" | "refunded">(
    "all",
  )
  const list = [...s.deposits].sort(
    (a, b) =>
      (a.status === "refunded" ? 1 : 0) - (b.status === "refunded" ? 1 : 0) ||
      a.roomNo - b.roomNo,
  )
  const shown = list.filter((d) => tab === "all" || d.status === tab)
  const disputes = s.deposits.filter((d) => d.status === "dispute")
  const refunded = s.deposits.filter((d) => d.status === "refunded")
  const deducted = refunded.reduce(
    (a, d) => a + (d.deductions ?? []).reduce((x, y) => x + y.amount, 0),
    0,
  )

  const badge = {
    locked: ["Terkunci Aman", tone.violet],
    dispute: ["Sengketa", tone.red],
    refunded: ["Cleared / Refunded", tone.green],
  } as const

  return (
    <div className="space-y-4">
      <PageHeader
        crumb="Rekonsiliasi Uang Deposit"
        title="Buku Besar Uang Jaminan (Deposit Ledger)"
        actions={
          <Btn
            variant="secondary"
            className="h-10"
            onClick={() =>
              downloadCsv(
                `Deposit-Ledger-${s.property.name.replace(/\s+/g, "-")}.csv`,
                [
                  [
                    "Kamar",
                    "Penghuni",
                    "Tgl Setor",
                    "Nominal",
                    "Status",
                    "Potongan",
                    "Refund",
                    "Tgl Refund",
                  ],
                  ...list.map((d) => [
                    d.roomNo,
                    d.tenantName,
                    fmtDate(d.date),
                    d.amount,
                    badge[d.status][0],
                    (d.deductions ?? []).reduce((a, x) => a + x.amount, 0),
                    d.refund ?? "",
                    d.refundDate ? fmtDate(d.refundDate) : "",
                  ]),
                ],
              )
            }
          >
            <Download className="size-4 text-slate-500" /> Ekspor Ledger (.csv)
          </Btn>
        }
      />

      <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-4">
        <div className="flex items-center gap-4 rounded-xl border border-[#E2D3C1] bg-[#F6EFE6] p-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-white text-[#5C432C] ring-1 ring-[#E2D3C1]">
            <Vault className="size-6" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[12px] font-medium text-[#5C432C]">
              Total Deposit Tersimpan
            </p>
            <p className="font-display text-[24px] font-bold text-[#2B211A] tabular-nums">
              {rupiah(s.stats.depositHeld)}
            </p>
            <p className="text-[11.5px] text-[#5C432C]/90">
              ({s.stats.depositCount} Kamar Terisi) · kewajiban ke penghuni
            </p>
          </div>
        </div>
        {[
          {
            icon: ShieldAlert,
            label: "Dalam Sengketa",
            v: rupiah(disputes.reduce((a, d) => a + d.amount, 0)),
            sub: `${disputes.length} kasus menunggu mediasi`,
            c: "text-rose-600",
            bg: "bg-[#F43F5E]/10 text-[#F43F5E]",
          },
          {
            icon: ArrowUpRight,
            label: "Sudah Dikembalikan",
            v: rupiah(refunded.reduce((a, d) => a + (d.refund ?? 0), 0)),
            sub: `${refunded.length} penghuni keluar`,
            c: "text-emerald-700",
            bg: "bg-[#10B981]/10 text-[#10B981]",
          },
          {
            icon: Scissors,
            label: "Total Potongan Kerusakan",
            v: rupiah(deducted),
            sub: "masuk ke pendapatan lain",
            c: "text-[#2B211A]",
            bg: "bg-[#F59E0B]/12 text-amber-600",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-[#E6E2D8] bg-white p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex size-6 items-center justify-center rounded-md ${k.bg}`}
              >
                <k.icon className="size-3.5" />
              </span>
              <p className="text-[12px] font-medium text-slate-500">
                {k.label}
              </p>
            </div>
            <p
              className={`mt-2 font-display text-[19px] font-bold tabular-nums ${k.c}`}
            >
              {k.v}
            </p>
            <p className="text-[11px] text-slate-500">{k.sub}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
        <div className="flex items-center justify-between border-b border-[#E6E2D8] px-4 py-3">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { k: "all", label: "Semua", n: list.length },
              {
                k: "locked",
                label: "Terkunci Aman",
                n: list.filter((d) => d.status === "locked").length,
                dot: "bg-[#5C432C]",
              },
              {
                k: "dispute",
                label: "Sengketa",
                n: disputes.length,
                dot: "bg-[#F43F5E]",
              },
              {
                k: "refunded",
                label: "Refunded",
                n: refunded.length,
                dot: "bg-[#10B981]",
              },
            ]}
          />
          <p className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
            <Lock className="size-3.5" /> Dana deposit dipisahkan dari kas
            operasional
          </p>
        </div>
        <div className="max-h-[calc(100vh-380px)] min-h-[340px] overflow-y-auto">
          <table className="w-full text-[12.5px]">
            <thead className="sticky top-0 z-10 bg-[#F3EFE8] border-b border-[#E6E2D8] text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-stone-600">
              <tr>
                <th className="px-4 py-2.5">No. Kamar</th>
                <th className="py-2.5 pr-3">Nama Penghuni</th>
                <th className="py-2.5 pr-3">Tgl Setor</th>
                <th className="py-2.5 pr-3 text-right">Nominal Masuk</th>
                <th className="py-2.5 pr-3">Status</th>
                <th className="py-2.5 pr-3 text-right">Potongan / Refund</th>
                <th className="px-4 py-2.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E2D8]">
              {shown.map((d) => {
                const cut = (d.deductions ?? []).reduce(
                  (a, x) => a + x.amount,
                  0,
                )
                return (
                  <tr
                    key={d.id}
                    className={
                      d.status === "refunded"
                        ? "bg-slate-50/60"
                        : "hover:bg-slate-50"
                    }
                  >
                    <td className="px-4 py-2.5 font-semibold text-slate-900 tabular-nums">
                      Kamar {d.roomNo}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                      {d.tenantName}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">
                      {fmtDate(d.date)}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-semibold text-slate-900 tabular-nums">
                      {rupiah(d.amount)}
                    </td>
                    <td className="py-2.5 pr-3">
                      <Pill cls={badge[d.status][1]}>{badge[d.status][0]}</Pill>
                    </td>
                    <td className="py-2.5 pr-3 text-right text-[12px] tabular-nums">
                      {d.status === "refunded" ? (
                        <>
                          <span className="text-rose-600">-{rupiah(cut)}</span>{" "}
                          ·{" "}
                          <span className="font-semibold text-emerald-700">
                            {rupiah(d.refund ?? 0)}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-end gap-1.5">
                        {d.status === "refunded" ? (
                          <button
                            onClick={() =>
                              s.openModal({
                                type: "doc",
                                doc: { kind: "clearance", depositId: d.id },
                              })
                            }
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-[#E6E2D8] px-2.5 text-[11.5px] font-semibold text-slate-600 hover:bg-white"
                          >
                            <FileText className="size-3.5" /> Berita Acara
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                s.setDepositStatus(
                                  d.id,
                                  d.status === "dispute" ? "locked" : "dispute",
                                )
                              }
                              title={
                                d.status === "dispute"
                                  ? "Selesaikan sengketa"
                                  : "Tandai sengketa"
                              }
                              className="inline-flex h-7 items-center gap-1 rounded-md border border-[#E6E2D8] px-2 text-[11.5px] font-semibold text-slate-600 hover:bg-white"
                            >
                              <Scale className="size-3.5" />{" "}
                              {d.status === "dispute"
                                ? "Selesai Mediasi"
                                : "Sengketa"}
                            </button>
                            <button
                              onClick={() => s.openCheckout(d.roomNo)}
                              className="inline-flex h-7 items-center rounded-md border border-[#F43F5E] px-2.5 text-[11.5px] font-semibold text-[#E11D48] hover:bg-[#FFF1F2]"
                            >
                              Proses Clearance
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
