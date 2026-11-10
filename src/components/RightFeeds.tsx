import {
  BadgeCheck,
  CalendarClock,
  Wallet,
  Clock,
  Zap,
  Trash2,
  Droplets,
  UserCog,
  ArrowUpRight,
  CheckCheck,
  AirVent,
  Wrench,
  Wifi,
} from "lucide-react"
import type { ReactNode } from "react"
import { rupiah, fmtShort, TODAY, type Room } from "@/lib/data"
import { useStore } from "@/store/store"

function Widget({
  icon,
  title,
  count,
  action,
  children,
}: {
  icon: ReactNode
  title: string
  count?: ReactNode
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-4 py-3">
        <span className="text-[#4F46E5]">{icon}</span>
        <h3 className="font-display text-[13px] font-bold text-slate-900">
          {title}
        </h3>
        {count}
        <div className="ml-auto">{action}</div>
      </div>
      {children}
    </section>
  )
}

function Receipt({ bank }: { bank: string }) {
  return (
    <div className="flex h-[52px] w-[38px] shrink-0 flex-col rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-1">
      <div className="flex h-2 items-center justify-center rounded-[2px] bg-[#312E81] text-[5px] font-bold text-white">
        {bank}
      </div>
      <div className="mx-auto mt-1 flex size-3 items-center justify-center rounded-full bg-[#10B981]">
        <CheckCheck className="size-2 text-white" strokeWidth={3} />
      </div>
      <div className="mt-1 space-y-[2px]">
        <div className="h-[2px] w-full rounded bg-slate-300" />
        <div className="h-[2px] w-3/4 rounded bg-slate-300" />
        <div className="h-[2px] w-full rounded bg-slate-200" />
      </div>
    </div>
  )
}

const CAT_ICON: Record<string, typeof Zap> = {
  Listrik: Zap,
  Kebersihan: Trash2,
  Air: Droplets,
  Gaji: UserCog,
  "Servis AC": AirVent,
  Perbaikan: Wrench,
  Internet: Wifi,
  Lainnya: Wallet,
}

export default function RightFeeds({
  rooms,
  onApprove,
  onReject,
}: {
  rooms: Room[]
  onApprove: (no: number) => void
  onReject: (no: number) => void
}) {
  const { tenants, expenses, invoices, navigate } = useStore()
  const queue = rooms.filter((r) => r.status === "verify")
  // Tenants whose due day falls 1 or 3 days after today (cron H-1 / H-3 targets).
  const today = Number(TODAY.slice(8, 10))
  const radar = rooms
    .filter((r) => r.status === "paid" && r.tenantId)
    .map((r) => ({ r, t: tenants.find((t) => t.id === r.tenantId)! }))
    .filter(({ t }) => t && (t.dueDay === today + 1 || t.dueDay === today + 3))
    .slice(0, 3)
    .map(({ r, t }) => {
      const h = t.dueDay === today + 1 ? "H-1" : "H-3"
      const first = t.name.replace("Muhammad ", "").split(" ")[0]
      const due = `${String(t.dueDay).padStart(2, "0")} Nov`
      return {
        room: r.no,
        name: t.name,
        h,
        due,
        msg:
          h === "H-1"
            ? `Halo Kak ${first}, sewa Kmr ${r.no} jatuh tempo besok (${due})...`
            : `Halo Kak ${first}, pengingat sewa Kmr ${r.no} jatuh tempo ${due}...`,
      }
    })
  const inToday = invoices
    .filter((i) => i.status === "paid" && i.paidOn === TODAY)
    .reduce((s, i) => s + i.amount, 0)
  const outToday = expenses
    .filter((e) => e.date === TODAY)
    .reduce((s, e) => s + e.amount, 0)
  const banks = ["BCA", "BRI", "MDR"]

  return (
    <div className="space-y-4">
      <Widget
        icon={<BadgeCheck className="size-4" strokeWidth={2} />}
        title="Antrean Verifikasi Pembayaran"
        count={
          queue.length > 0 && (
            <span className="rounded-full bg-[#F59E0B]/12 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              {queue.length} Butuh Approval
            </span>
          )
        }
      >
        {queue.length === 0 ? (
          <p className="flex items-center justify-center gap-1.5 px-4 py-6 text-[12px] text-slate-500">
            <CheckCheck className="size-4 text-[#10B981]" /> Semua bukti
            transfer sudah diverifikasi.
          </p>
        ) : (
          <ul className="divide-y divide-[#E2E8F0]">
            {queue.map((r, i) => (
              <li key={r.no} className="flex gap-3 px-4 py-3">
                <Receipt bank={banks[i % banks.length]} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-semibold text-slate-900">
                        {r.tenant}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Kmr {r.no} · Diunggah {i === 0 ? "12 mnt" : "1 jam"}{" "}
                        lalu
                      </p>
                    </div>
                    <p className="text-[12.5px] font-bold text-slate-900 tabular-nums">
                      {rupiah(r.price)}
                    </p>
                  </div>
                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={() => onReject(r.no)}
                      className="h-7 flex-1 rounded-md border border-[#E2E8F0] text-[11.5px] font-semibold text-slate-600 hover:border-[#F43F5E]/40 hover:text-rose-600"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => onApprove(r.no)}
                      className="h-7 flex-[1.6] rounded-md bg-[#10B981] text-[11.5px] font-semibold text-white hover:bg-[#059669]"
                    >
                      Setujui Lunas
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Widget>

      <Widget
        icon={<CalendarClock className="size-4" strokeWidth={2} />}
        title="Radar Jatuh Tempo WhatsApp"
        count={
          <span className="rounded-full bg-[#F5F3FF] px-1.5 py-0.5 text-[10px] font-semibold text-[#4F46E5]">
            48 Jam
          </span>
        }
      >
        <ul className="divide-y divide-[#E2E8F0]">
          {radar.length === 0 && (
            <li className="px-4 py-5 text-center text-[12px] text-slate-500">
              Tidak ada jatuh tempo dalam 48 jam ke depan.
            </li>
          )}
          {radar.map((t) => (
            <li key={t.room} className="px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                    t.h === "H-1"
                      ? "bg-[#F43F5E]/10 text-rose-600"
                      : "bg-[#F59E0B]/12 text-amber-700"
                  }`}
                >
                  {t.h}
                </span>
                <p className="text-[12px] font-semibold text-slate-900">
                  {t.name}
                </p>
                <p className="text-[11px] text-slate-500">Kmr {t.room}</p>
                <p className="ml-auto text-[11px] text-slate-500">{t.due}</p>
              </div>
              <div className="mt-1.5 rounded-lg rounded-tl-sm bg-[#10B981]/[0.07] px-2.5 py-1.5 text-[11px] leading-snug text-slate-700">
                {t.msg}
              </div>
              <p className="mt-1 flex items-center gap-1 text-[10.5px] font-medium text-emerald-700">
                <Clock className="size-3" /> Siap Dikirim via Cron Job · 08:00
                WIB
              </p>
            </li>
          ))}
        </ul>
      </Widget>

      <Widget
        icon={<Wallet className="size-4" strokeWidth={2} />}
        title="Ringkasan Arus Kas Harian"
        action={
          <button
            onClick={() => navigate("finance", "kas")}
            className="flex items-center gap-0.5 text-[11.5px] font-semibold text-[#4F46E5] hover:text-[#4338CA]"
          >
            Semua <ArrowUpRight className="size-3.5" />
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2 px-4 pt-3">
          <div className="rounded-lg bg-[#10B981]/[0.07] px-2.5 py-2">
            <p className="text-[10.5px] text-emerald-700">Masuk hari ini</p>
            <p className="text-[13px] font-bold text-emerald-700 tabular-nums">
              +{rupiah(inToday)}
            </p>
          </div>
          <div className="rounded-lg bg-[#F5F3FF] px-2.5 py-2">
            <p className="text-[10.5px] text-[#4F46E5]">Keluar hari ini</p>
            <p className="text-[13px] font-bold text-slate-900 tabular-nums">
              -{rupiah(outToday)}
            </p>
          </div>
        </div>
        <ul className="px-4 py-2">
          {expenses
            .slice(0, 4)
            .map(({ id, category: cat, desc: label, date, amount: amt }) => {
              const Icon = CAT_ICON[cat] ?? Wallet
              const time = date === TODAY ? "Hari ini" : fmtShort(date)
              return (
                <li key={id} className="flex items-center gap-2.5 py-1.5">
                  <span className="flex size-7 items-center justify-center rounded-md border border-[#E2E8F0] text-slate-500">
                    <Icon className="size-3.5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-slate-900">
                      {label}
                    </p>
                    <p className="text-[10.5px] text-slate-500">
                      {cat} · {time}
                    </p>
                  </div>
                  <p className="text-[12px] font-semibold text-slate-900 tabular-nums">
                    -{rupiah(amt)}
                  </p>
                </li>
              )
            })}
        </ul>
      </Widget>
    </div>
  )
}
