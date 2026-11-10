import {
  BedDouble,
  Banknote,
  AlertCircle,
  AirVent,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from "lucide-react"
import type { ReactNode } from "react"
import { rupiah, fmtDate, since } from "@/lib/data"
import { useStore } from "@/store/store"

function Card({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-[#F5F3FF] text-[#4F46E5]">
          {icon}
        </span>
        <p className="text-[12px] font-medium text-slate-500">{label}</p>
      </div>
      {children}
    </div>
  )
}

const Pill = ({ children, cls }: { children: ReactNode; cls: string }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${cls}`}
  >
    {children}
  </span>
)

export default function StatCards() {
  const { rooms, stats, sendReminder, navigate } = useStore()
  const pct = rooms.length
    ? ((stats.occupied / rooms.length) * 100).toFixed(1)
    : "0"
  const collected = stats.totalBilled
    ? Math.round((stats.income / stats.totalBilled) * 100)
    : 0
  const overdueSum = stats.overdue.reduce((s, r) => s + r.price, 0)
  const ac = stats.acOverdue[0]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={<BedDouble className="size-3.5" strokeWidth={2} />}
        label="Tingkat Okupansi Real-time"
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-[26px] font-bold leading-none tracking-tight text-slate-900 tabular-nums">
            {pct}%
          </p>
          <Pill cls="bg-[#F59E0B]/12 text-amber-700 ring-1 ring-inset ring-[#F59E0B]/30">
            Target 100%
          </Pill>
        </div>
        <p className="mt-2 text-[11.5px] text-slate-500">
          <span className="font-medium text-slate-700">
            {stats.occupied} Kamar Terisi
          </span>{" "}
          · {stats.vacant} Kamar Kosong
        </p>
        <div className="mt-auto flex gap-[2px] pt-3">
          {rooms.length <= 40 ? (
            rooms.map((r) => (
              <span
                key={r.no}
                className={`h-1.5 flex-1 rounded-[1px] ${
                  r.status === "vacant" ? "bg-[#E2E8F0]" : "bg-[#10B981]"
                }`}
              />
            ))
          ) : (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
              <div
                className="h-full bg-[#10B981]"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>
      </Card>

      <Card
        icon={<Banknote className="size-3.5" strokeWidth={2} />}
        label="Arus Kas Masuk Bulan Ini"
      >
        <p className="font-display text-[26px] font-bold leading-none tracking-tight text-slate-900 tabular-nums">
          {rupiah(stats.income)}
        </p>
        <div className="mt-2">
          <Pill cls="bg-[#10B981]/10 text-emerald-700">
            <TrendingUp className="size-3" strokeWidth={2.4} /> {collected}%
            dari target tagihan
          </Pill>
        </div>
        <p className="mt-auto flex items-center gap-1 pt-3 text-[11.5px] text-slate-500">
          <CheckCircle2 className="size-3.5 text-[#10B981]" /> Terverifikasi
          dari {stats.paidCount} transaksi sewa
        </p>
      </Card>

      <Card
        icon={<AlertCircle className="size-3.5" strokeWidth={2} />}
        label="Tagihan Tertunggak / Piutang"
      >
        <p
          className={`font-display text-[26px] font-bold leading-none tracking-tight tabular-nums ${
            overdueSum ? "text-[#E11D48]" : "text-emerald-600"
          }`}
        >
          {rupiah(overdueSum)}
        </p>
        <div className="mt-2">
          <Pill
            cls={
              stats.overdue.length
                ? "bg-[#F43F5E]/10 text-rose-700"
                : "bg-[#10B981]/10 text-emerald-700"
            }
          >
            {stats.overdue.length} Penghuni Nunggak
          </Pill>
        </div>
        <button
          onClick={() => sendReminder(stats.overdue.map((r) => r.no))}
          disabled={!stats.overdue.length}
          className="mt-auto flex items-center gap-1.5 pt-3 text-left text-[12px] font-semibold text-[#4F46E5] hover:text-[#4338CA] disabled:text-slate-400"
        >
          Kirim Pengingat WA Otomatis <ArrowRight className="size-3.5" />
        </button>
      </Card>

      <Card
        icon={<AirVent className="size-3.5" strokeWidth={2} />}
        label="Jadwal Servis Preventif Aset"
      >
        <p className="font-display text-[26px] font-bold leading-none tracking-tight text-slate-900">
          {stats.acOverdue.length
            ? `${stats.acOverdue.length} AC Perlu Cuci`
            : "Semua AC Aman"}
        </p>
        <div className="mt-2">
          <Pill
            cls={
              stats.acOverdue.length
                ? "bg-[#F59E0B]/12 text-amber-700 ring-1 ring-inset ring-[#F59E0B]/30"
                : "bg-[#10B981]/10 text-emerald-700"
            }
          >
            Siklus 5 Bulan
          </Pill>
        </div>
        <button
          onClick={() => navigate("maintenance")}
          className="mt-auto pt-3 text-left text-[11.5px] text-slate-500 hover:text-[#4F46E5]"
        >
          {ac ? (
            <>
              <span className="font-medium text-slate-700">
                Kamar {ac.room}
              </span>{" "}
              · Terakhir: {fmtDate(ac.last)} ({since(ac.last).m} bln)
            </>
          ) : (
            "Tidak ada unit melewati siklus"
          )}
        </button>
      </Card>
    </div>
  )
}
