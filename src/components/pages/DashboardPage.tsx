import { useStore } from "@/store/store"
import { fmtDate, TODAY } from "@/lib/data"
import StatCards from "../StatCards"
import RoomGrid from "../RoomGrid"
import RightFeeds from "../RightFeeds"

export default function DashboardPage() {
  const s = useStore()
  const onAction = (r: typeof s.rooms[number]) => {
    if (r.status === "overdue") s.sendReminder([r.no])
    if (r.status === "verify")
      document
        .getElementById("verifikasi")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    if (r.status === "vacant") s.openModal({ type: "checkIn", roomNo: r.no })
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-[20px] font-bold tracking-tight text-slate-900">
            Master Cockpit
          </h1>
          <p className="text-[12px] sm:text-[12.5px] text-slate-500">
            Rabu, {fmtDate(TODAY)} · Ringkasan operasional, keuangan & penghuni
            secara real-time
          </p>
        </div>
        <p className="text-[11px] sm:text-[11.5px] text-slate-400">
          {s.property.name} · data tersinkron di semua modul
        </p>
      </div>
      <StatCards />
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,65fr)_minmax(0,35fr)] items-start gap-4">
        <RoomGrid
          rooms={s.rooms}
          onAction={onAction}
          onOpen={(r) => s.openDrawer(r.no)}
        />
        <div id="verifikasi" className="scroll-mt-24">
          <RightFeeds
            rooms={s.rooms}
            onApprove={s.approvePayment}
            onReject={s.rejectPayment}
          />
        </div>
      </div>
    </div>
  )
}
