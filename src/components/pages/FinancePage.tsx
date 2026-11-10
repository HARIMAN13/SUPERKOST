import {
  Download,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  CalendarDays,
  Receipt,
  Zap,
  Droplets,
  UserCog,
  AirVent,
  Wrench,
  Wifi,
  Trash,
  Tag,
} from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import {
  rupiah,
  fmtDate,
  TODAY,
  EXPENSE_CATEGORIES,
  PERIOD,
  type ExpenseCategory,
} from "@/lib/data"
import { downloadCsv } from "@/lib/lib"
import {
  PageHeader,
  Tabs,
  Pill,
  tone,
  Btn,
  ModalShell,
  Field,
  SelectBox,
  MoneyInput,
  inputCls,
} from "../ui"

const CAT_ICON: Record<ExpenseCategory, typeof Zap> = {
  Listrik: Zap,
  Air: Droplets,
  Kebersihan: Trash,
  Gaji: UserCog,
  "Servis AC": AirVent,
  Internet: Wifi,
  Perbaikan: Wrench,
  Lainnya: Tag,
}
const CAT_COLOR: Record<ExpenseCategory, string> = {
  Gaji: "bg-[#4F46E5]",
  Air: "bg-[#0EA5E9]",
  Listrik: "bg-[#F59E0B]",
  "Servis AC": "bg-[#10B981]",
  Internet: "bg-[#8B5CF6]",
  Kebersihan: "bg-[#64748B]",
  Perbaikan: "bg-[#F43F5E]",
  Lainnya: "bg-[#94A3B8]",
}
// Archived months (Jun–Okt) shown relative to the live month for the trend chart.
const HISTORY = [
  ["Jun", 0.93, 0.92],
  ["Jul", 0.96, 0.97],
  ["Agu", 0.98, 0.89],
  ["Sep", 1.01, 1.08],
  ["Okt", 0.99, 0.94],
] as const

export default function FinancePage() {
  const s = useStore()
  const { stats, expenses } = s
  const tab = s.financeTab
  const [cat, setCat] = useState<"all" | ExpenseCategory>("all")
  const [adding, setAdding] = useState(false)

  const totalIncome = stats.income + stats.otherIncome
  const margin = totalIncome ? (stats.net / totalIncome) * 100 : 0
  const shown = expenses.filter((e) => cat === "all" || e.category === cat)
  const byCat = EXPENSE_CATEGORIES.map((c) => ({
    c,
    v: expenses
      .filter((e) => e.category === c)
      .reduce((a, e) => a + e.amount, 0),
  }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v)

  const exportExcel = () => {
    downloadCsv(
      `Laporan-Keuangan-${s.property.name.replace(/\s+/g, "-")}-November-2026.csv`,
      [
        ["LAPORAN KEUANGAN", s.property.name, PERIOD],
        [],
        ["Ringkasan", "Nominal"],
        ["Pendapatan sewa", stats.income],
        ["Pendapatan lain (potongan deposit)", stats.otherIncome],
        ["Total pengeluaran", stats.expenseTotal],
        ["Laba bersih", stats.net],
        [],
        ["Tanggal", "Kategori", "Keterangan", "Sumber", "Nominal"],
        ...expenses.map((e) => [
          fmtDate(e.date),
          e.category,
          e.desc,
          e.source,
          e.amount,
        ]),
      ],
    )
    s.notify("Laporan November 2026 diunduh (.csv, buka dengan Excel)")
  }

  const max = Math.max(
    ...HISTORY.map(([, i]) => i * stats.income),
    stats.income,
    1,
  )

  return (
    <div className="space-y-4">
      <PageHeader
        crumb="Arus Kas, Pengeluaran & Laporan Laba Bersih"
        title="Laporan Finansial & Pembukuan Kas Operasional"
        actions={
          <>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <select
                className="h-10 appearance-none rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-8 text-[12.5px] font-semibold text-slate-800 outline-none focus:border-[#6366F1]"
                defaultValue="nov"
              >
                <option value="nov">November 2026</option>
                <option disabled>Okt 2026 · arsip</option>
                <option disabled>Sep 2026 · arsip</option>
              </select>
            </div>
            <Btn variant="secondary" className="h-10" onClick={exportExcel}>
              <Download className="size-4 text-emerald-600" /> Ekspor Laporan
              Excel
            </Btn>
            <Btn
              variant="secondary"
              className="h-10"
              onClick={() =>
                s.openModal({ type: "doc", doc: { kind: "report" } })
              }
            >
              <FileText className="size-4 text-rose-500" /> Unduh Ringkasan PDF
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-[#10B981]/10 text-[#10B981]">
              <TrendingUp className="size-3.5" />
            </span>
            <p className="text-[12px] font-medium text-slate-500">
              Total Pemasukan Sewa
            </p>
          </div>
          <p className="mt-2 font-display text-[24px] font-bold text-[#1E1B4B] tabular-nums">
            {rupiah(stats.income)}
          </p>
          <p className="text-[11.5px] text-slate-500">
            Terverifikasi otomatis dari modul tagihan · {stats.paidCount}{" "}
            transaksi
            {stats.otherIncome > 0 && (
              <span className="text-emerald-700">
                {" "}
                · +{rupiah(stats.otherIncome)} potongan deposit
              </span>
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-[#F43F5E]/10 text-[#F43F5E]">
              <TrendingDown className="size-3.5" />
            </span>
            <p className="text-[12px] font-medium text-slate-500">
              Total Pengeluaran Operasional
            </p>
          </div>
          <p className="mt-2 font-display text-[24px] font-bold text-[#1E1B4B] tabular-nums">
            {rupiah(stats.expenseTotal)}
          </p>
          <p className="text-[11.5px] text-slate-500">
            Dihitung otomatis dari {expenses.length} entri Buku Kas
          </p>
        </div>
        <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/[0.05] p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-[#10B981] text-white">
              <Wallet className="size-3.5" />
            </span>
            <p className="text-[12px] font-medium text-emerald-800">
              Laba Bersih Operasional (Net Profit)
            </p>
          </div>
          <p
            className={`mt-2 font-display text-[26px] font-extrabold tabular-nums ${
              stats.net >= 0 ? "text-[#10B981]" : "text-[#F43F5E]"
            }`}
          >
            {rupiah(stats.net)}
          </p>
          <p className="text-[11.5px] text-emerald-800/80">
            Margin {margin.toFixed(1)}% · pemasukan − pengeluaran
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tabs
          value={tab}
          onChange={(t) => s.navigate("finance", t)}
          items={[
            { k: "kas", label: "Buku Kas Pengeluaran", n: expenses.length },
            { k: "laba", label: "Laporan Laba Rugi Eksekutif" },
          ]}
        />
      </div>

      {tab === "kas" ? (
        <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3">
            <div className="flex flex-wrap gap-1.5">
              {(["all", ...EXPENSE_CATEGORIES] as const).map((c) => {
                const n =
                  c === "all"
                    ? expenses.length
                    : expenses.filter((e) => e.category === c).length
                if (c !== "all" && !n) return null
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`rounded-full border px-2.5 py-1 text-[11.5px] font-medium ${
                      cat === c
                        ? "border-[#4F46E5] bg-[#F5F3FF] text-[#4F46E5]"
                        : "border-[#E2E8F0] text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {c === "all" ? "Semua" : c}{" "}
                    <span className="opacity-60">({n})</span>
                  </button>
                )
              })}
            </div>
            <Btn onClick={() => setAdding(true)}>
              <Plus className="size-4" strokeWidth={2.4} /> Catat Biaya Baru
            </Btn>
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-[#1E1B4B] text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-indigo-100">
              <tr>
                <th className="px-4 py-2.5">Tanggal</th>
                <th className="py-2.5 pr-3">Kategori</th>
                <th className="py-2.5 pr-3">Keterangan</th>
                <th className="py-2.5 pr-3">Sumber</th>
                <th className="py-2.5 pr-3 text-right">Nominal</th>
                <th className="w-12 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {shown.map((e) => {
                const Icon = CAT_ICON[e.category]
                return (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-600">
                      {e.date === TODAY ? "Hari ini" : fmtDate(e.date)}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <span className="flex size-6 items-center justify-center rounded-md border border-[#E2E8F0] text-slate-500">
                          <Icon className="size-3.5" />
                        </span>
                        {e.category}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-slate-900">
                      {e.desc}
                    </td>
                    <td className="py-2.5 pr-3">
                      <Pill
                        cls={
                          e.source === "Tiket Servis"
                            ? tone.green
                            : e.source === "Sistem"
                              ? tone.violet
                              : tone.slate
                        }
                      >
                        {e.source}
                      </Pill>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-semibold text-rose-600 tabular-nums">
                      -{rupiah(e.amount)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {e.source === "Manual" && (
                        <button
                          onClick={() => s.removeExpense(e.id)}
                          aria-label="Hapus"
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <td
                  colSpan={4}
                  className="px-4 py-2.5 text-[12px] font-semibold text-slate-600"
                >
                  Total {cat === "all" ? "pengeluaran" : cat}
                </td>
                <td className="py-2.5 pr-3 text-right font-bold text-rose-600 tabular-nums">
                  -{rupiah(shown.reduce((a, e) => a + e.amount, 0))}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </section>
      ) : (
        <div className="grid grid-cols-[1.2fr_1fr] gap-4">
          <section className="rounded-xl border border-[#E2E8F0] bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[14px] font-bold text-[#1E1B4B]">
                Cash Flow Masuk vs Keluar (6 Bulan)
              </h3>
              <div className="flex gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-[#4F46E5]" /> Masuk
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-sm bg-[#F43F5E]" /> Keluar
                </span>
              </div>
            </div>
            <div className="mt-4 flex h-[220px] items-end gap-5 border-b border-[#E2E8F0] px-2">
              {[
                ...HISTORY.map(
                  ([m, i, o]) =>
                    [
                      m,
                      i * stats.income,
                      o * stats.expenseTotal,
                      false,
                    ] as const,
                ),
                ["Nov", stats.income, stats.expenseTotal, true] as const,
              ].map(([m, i, o, live]) => (
                <div
                  key={m}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div className="flex h-[200px] w-full items-end justify-center gap-1">
                    <div
                      title={rupiah(i)}
                      className={`w-1/2 max-w-[22px] rounded-t ${
                        live ? "bg-[#4F46E5]" : "bg-[#4F46E5]/45"
                      }`}
                      style={{ height: `${(i / max) * 100}%` }}
                    />
                    <div
                      title={rupiah(o)}
                      className={`w-1/2 max-w-[22px] rounded-t ${
                        live ? "bg-[#F43F5E]" : "bg-[#F43F5E]/45"
                      }`}
                      style={{ height: `${Math.max(2, (o / max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-5 px-2 pt-1.5">
              {[...HISTORY.map(([m]) => m), "Nov"].map((m) => (
                <p
                  key={m}
                  className={`flex-1 text-center text-[11px] ${
                    m === "Nov" ? "font-bold text-[#1E1B4B]" : "text-slate-500"
                  }`}
                >
                  {m}
                  {m === "Nov" && " (live)"}
                </p>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-xl border border-[#C7D2FE] bg-[#F5F3FF] p-4">
              <p className="text-[12px] font-medium text-[#4338CA]">
                Profit Margin Operasional
              </p>
              <div className="mt-1 flex items-end gap-3">
                <p className="font-display text-[32px] font-extrabold leading-none text-[#1E1B4B]">
                  {margin.toFixed(1)}%
                </p>
                <p className="pb-1 text-[11.5px] text-[#4338CA]/80">
                  dari total pemasukan {rupiah(totalIncome)}
                </p>
              </div>
              <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-[#C7D2FE]">
                <div
                  className="bg-[#10B981]"
                  style={{ width: `${Math.max(0, margin)}%` }}
                />
                <div
                  className="bg-[#F43F5E]"
                  style={{
                    width: `${Math.min(100, 100 - Math.max(0, margin))}%`,
                  }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px]">
                <span className="font-semibold text-emerald-700">
                  Laba {rupiah(stats.net)}
                </span>
                <span className="font-semibold text-rose-600">
                  Biaya {rupiah(stats.expenseTotal)}
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <h3 className="flex items-center gap-2 font-display text-[13.5px] font-bold text-[#1E1B4B]">
                <Receipt className="size-4 text-[#4F46E5]" /> Struktur Biaya
              </h3>
              <ul className="mt-3 space-y-2.5">
                {byCat.map(({ c, v }) => (
                  <li key={c}>
                    <div className="flex justify-between text-[12px]">
                      <span className="font-medium text-slate-700">{c}</span>
                      <span className="text-slate-500 tabular-nums">
                        {rupiah(v)} ·{" "}
                        <b className="text-slate-800">
                          {((v / stats.expenseTotal) * 100).toFixed(0)}%
                        </b>
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F1F5F9]">
                      <div
                        className={`h-full rounded-full ${CAT_COLOR[c]}`}
                        style={{ width: `${(v / stats.expenseTotal) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}

      {adding && <ExpenseModal onClose={() => setAdding(false)} />}
    </div>
  )
}

function ExpenseModal({ onClose }: { onClose: () => void }) {
  const s = useStore()
  const [date, setDate] = useState(TODAY)
  const [category, setCategory] = useState<ExpenseCategory>("Listrik")
  const [desc, setDesc] = useState("")
  const [amount, setAmount] = useState(0)
  const [touched, setTouched] = useState(false)
  const valid = desc.trim().length >= 3 && amount > 0
  return (
    <ModalShell
      title="Catat Biaya Operasional Baru"
      subtitle="Masuk ke Buku Kas & langsung mengurangi laba bersih"
      icon={<Plus className="size-[18px]" />}
      onClose={onClose}
      width={480}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>
            Batal
          </Btn>
          <Btn
            onClick={() => {
              setTouched(true)
              if (!valid) return
              s.addExpense({
                date,
                category,
                desc: desc.trim(),
                amount,
                source: "Manual",
              })
              s.notify(
                `Biaya ${category} ${rupiah(amount)} dicatat · laba bersih diperbarui`,
              )
              onClose()
            }}
          >
            Simpan Biaya
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        <Field label="Tanggal">
          <input
            type="date"
            value={date}
            max={TODAY}
            min="2026-11-01"
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Kategori">
          <SelectBox
            value={category}
            onChange={(v) => setCategory(v as ExpenseCategory)}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectBox>
        </Field>
        <Field
          label="Keterangan"
          className="col-span-2"
          error={
            touched && desc.trim().length < 3 ? "Isi keterangan biaya" : ""
          }
        >
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Contoh: Token listrik pompa air"
            className={inputCls}
          />
        </Field>
        <Field
          label="Nominal"
          className="col-span-2"
          error={touched && !amount ? "Nominal wajib diisi" : ""}
        >
          <MoneyInput
            value={amount}
            onChange={setAmount}
            invalid={touched && !amount}
          />
        </Field>
      </div>
    </ModalShell>
  )
}
