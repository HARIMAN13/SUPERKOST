import {
  Wallet,
  DoorOpen,
  TriangleAlert,
  CheckCircle2,
  Circle,
  Send,
  Plus,
  ClipboardCheck,
  Banknote,
  Wrench,
} from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import { rupiah, TODAY, fmtDate } from "@/lib/data"
import { Btn } from "../ui"

export default function StaffPage() {
  const s = useStore()
  const [showVacant, setShowVacant] = useState(false)
  const done = s.tasks.filter((t) => t.done).length
  const vacant = s.rooms.filter((r) => r.status === "vacant")
  const cashToday = s.invoices.filter(
    (i) => i.status === "paid" && i.paidOn === TODAY,
  )
  const openTickets = s.tickets.filter((t) => t.status === "open")

  const big = [
    {
      n: 1,
      icon: Wallet,
      title: "Catat Pembayaran",
      sub: "Tunai / Transfer",
      c: "bg-[#10B981] hover:bg-[#059669] text-white",
      go: () => s.openModal({ type: "payment", method: "Tunai" }),
      badge: `${s.stats.overdue.length + s.stats.verify.length} belum lunas`,
    },
    {
      n: 2,
      icon: DoorOpen,
      title: "Cek Kamar Kosong",
      sub: "Untuk calon penghuni",
      c: "bg-[#141413] hover:bg-stone-800 text-white",
      go: () => setShowVacant((v) => !v),
      badge: `${vacant.length} kamar siap huni`,
    },
    {
      n: 3,
      icon: TriangleAlert,
      title: "Lapor Kerusakan",
      sub: "AC, air, listrik, bangunan",
      c: "bg-[#F43F5E] hover:bg-[#E11D48] text-white",
      go: () => s.openModal({ type: "ticket" }),
      badge: `${openTickets.length} tiket berjalan`,
    },
  ]

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[12px] font-medium text-slate-500">
            {fmtDate(TODAY)} · {s.property.name}
          </p>
          <h1 className="font-display text-[24px] font-bold tracking-tight text-[#141413]">
            Halo, Pak Darto — Shift Pagi
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {big.map((b) => (
          <button
            key={b.n}
            onClick={b.go}
            className={`group relative flex min-h-[168px] flex-col justify-between rounded-2xl p-5 text-left transition-colors ${b.c}`}
          >
            <div className="flex items-start justify-between">
              <span className="flex size-14 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <b.icon className="size-7" strokeWidth={1.9} />
              </span>
              <span className="font-display text-[40px] font-extrabold leading-none text-white/25">
                {b.n}
              </span>
            </div>
            <div>
              <p className="font-display text-[20px] font-bold">{b.title}</p>
              <p className="text-[13px] text-white/80">{b.sub}</p>
              <span className="mt-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11.5px] font-semibold">
                {b.badge}
              </span>
            </div>
          </button>
        ))}
      </div>

      {showVacant && (
        <section className="rounded-2xl border border-[#DFD2BE] bg-[#F5EFE6] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[15px] font-bold text-[#141413]">
              Kamar Kosong Siap Huni ({vacant.length})
            </h2>
            <button
              onClick={() => setShowVacant(false)}
              className="text-[12px] font-semibold text-[#8C6D3F]"
            >
              Tutup
            </button>
          </div>
          {vacant.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-slate-600">
              Semua kamar terisi penuh. Okupansi 100%!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {vacant.map((r) => (
                <div
                  key={r.no}
                  className="rounded-xl border border-dashed border-[#C5A572] bg-white p-3"
                >
                  <p className="font-display text-[18px] font-bold text-[#141413]">
                    {r.no}
                  </p>
                  <p className="text-[11.5px] text-slate-500">
                    {r.type} · Lt {r.floor}
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-slate-800 tabular-nums">
                    {rupiah(r.price)}
                  </p>
                  <button
                    onClick={() =>
                      s.openModal({ type: "checkIn", roomNo: r.no })
                    }
                    className="mt-2 flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-[#141413] text-[12px] font-semibold text-white hover:bg-stone-800"
                  >
                    <Plus className="size-3.5" strokeWidth={2.6} /> Check-In
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-[#E6E2D8] bg-white">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] px-5 py-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="size-5 text-[#8C6D3F]" />
              <h2 className="font-display text-[16px] font-bold text-[#141413]">
                Checklist Harian Staf
              </h2>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${
                done === s.tasks.length
                  ? "bg-[#10B981]/12 text-emerald-700"
                  : "bg-[#F59E0B]/12 text-amber-700"
              }`}
            >
              {done}/{s.tasks.length} selesai
            </span>
          </div>
          <div className="px-5 pt-3">
            <div className="h-2 overflow-hidden rounded-full bg-[#F3F0EA]">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all"
                style={{ width: `${(done / s.tasks.length) * 100}%` }}
              />
            </div>
          </div>
          <ul className="space-y-2 p-4">
            {s.tasks.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => s.toggleTask(t.id)}
                  role="checkbox"
                  aria-checked={t.done}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                    t.done
                      ? "border-[#10B981]/30 bg-[#10B981]/[0.06]"
                      : "border-[#E6E2D8] hover:border-[#DFD2BE] hover:bg-[#F5EFE6]"
                  }`}
                >
                  {t.done ? (
                    <CheckCircle2 className="size-6 shrink-0 text-[#10B981]" />
                  ) : (
                    <Circle className="size-6 shrink-0 text-slate-300" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[14px] font-semibold ${
                        t.done
                          ? "text-slate-500 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="block text-[12px] text-slate-500">
                      {t.area}
                    </span>
                  </span>
                  {t.done && (
                    <span className="text-[11.5px] font-medium text-emerald-700">
                      Selesai {t.at}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-[#E6E2D8] p-4">
            <Btn
              variant={done === s.tasks.length ? "success" : "secondary"}
              className="h-11 w-full text-[13px]"
              disabled={done === 0}
              onClick={() => {
                s.wa.push([
                  {
                    time: new Date()
                      .toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(".", ":"),
                    room: null,
                    name: "Owner",
                    tpl: "Laporan Shift Penjaga",
                  },
                ])
                s.notify(
                  `Laporan shift (${done}/${s.tasks.length} tugas) dikirim ke Owner via WhatsApp`,
                )
              }}
            >
              <Send className="size-4" /> Kirim Laporan Shift ke Owner
            </Btn>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-[#E6E2D8] bg-white p-4">
            <div className="flex items-center gap-2">
              <Banknote className="size-5 text-[#10B981]" />
              <h2 className="font-display text-[15px] font-bold text-[#141413]">
                Uang Masuk Hari Ini
              </h2>
            </div>
            <p className="mt-2 font-display text-[26px] font-bold text-emerald-700 tabular-nums">
              {rupiah(cashToday.reduce((a, i) => a + i.amount, 0))}
            </p>
            <p className="text-[12px] text-slate-500">
              {cashToday.length} transaksi · tunai di laci:{" "}
              <b className="text-slate-800">
                {rupiah(
                  cashToday
                    .filter((i) => i.method === "Tunai")
                    .reduce((a, i) => a + i.amount, 0),
                )}
              </b>
            </p>
            <ul className="mt-3 divide-y divide-[#E6E2D8]">
              {cashToday.length === 0 && (
                <li className="py-3 text-center text-[12px] text-slate-400">
                  Belum ada pembayaran hari ini.
                </li>
              )}
              {cashToday.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center justify-between py-2 text-[12.5px]"
                >
                  <span>
                    <b className="text-slate-800">Kamar {i.roomNo}</b>{" "}
                    <span className="text-slate-500">· {i.method}</span>
                  </span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {rupiah(i.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-[#E6E2D8] bg-white p-4">
            <div className="flex items-center gap-2">
              <Wrench className="size-5 text-amber-600" />
              <h2 className="font-display text-[15px] font-bold text-[#141413]">
                Tiket Kerusakan Berjalan
              </h2>
            </div>
            <ul className="mt-2 divide-y divide-[#E6E2D8]">
              {openTickets.length === 0 && (
                <li className="py-3 text-center text-[12px] text-slate-400">
                  Tidak ada tiket terbuka.
                </li>
              )}
              {openTickets.map((t) => (
                <li key={t.id} className="py-2 text-[12.5px]">
                  <p className="font-semibold text-slate-800">
                    {t.job} · {t.room ? `Kamar ${t.room}` : "Area Umum"}
                  </p>
                  <p className="text-[11.5px] text-slate-500">
                    {t.vendor} · {fmtDate(t.date)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
