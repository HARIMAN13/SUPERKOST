import { UserPlus } from "lucide-react"
import { useStore } from "@/store/store"
import { rupiah, type Room } from "@/lib/data"
import RoomGrid from "../RoomGrid"
import { PageHeader } from "../ui"

export function useRoomAction() {
  const s = useStore()
  return (r: Room) => {
    if (r.status === "overdue") s.sendReminder([r.no])
    if (r.status === "verify") s.navigate("billing")
    if (r.status === "vacant") s.openModal({ type: "checkIn", roomNo: r.no })
  }
}

export default function RoomsPage() {
  const s = useStore()
  const onAction = useRoomAction()
  const types = [...new Set(s.rooms.map((r) => r.type))]
  return (
    <div className="space-y-4">
      <PageHeader
        crumb="Denah & Manajemen Kamar"
        title={`Denah ${s.property.name}`}
        actions={
          <button
            onClick={() => s.openModal({ type: "checkIn" })}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#8A6543] px-4 text-[13px] font-semibold text-white hover:bg-[#735335]"
          >
            <UserPlus className="size-4" /> Check-In Penghuni Baru
          </button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
        {[
          [
            "Total Kamar",
            `${s.rooms.length} kamar`,
            `${[...new Set(s.rooms.map((r) => r.floor))].length} lantai`,
          ],
          [
            "Terisi",
            `${s.stats.occupied} kamar`,
            `${s.rooms.length ? ((s.stats.occupied / s.rooms.length) * 100).toFixed(1) : "0"}% okupansi`,
          ],
          [
            "Kosong & Siap Huni",
            `${s.stats.vacant} kamar`,
            s.stats.vacant
              ? "klik kartu kosong untuk check-in"
              : "okupansi penuh",
          ],
          [
            "Tarif per Tipe",
            types.length
              ? types
                  .map((t) =>
                    `${t} ${rupiah(s.rooms.find((r) => r.type === t)!.price / 1000)}rb`.replace(
                      "Rp",
                      "",
                    ),
                  )
                  .join(" · ")
              : "—",
            "ubah via drawer > Edit Tarif",
          ],
        ].map(([l, v, sub], i) => (
          <div
            key={l}
            className={`px-4 py-3 ${i ? "border-l border-[#E6E2D8]" : ""}`}
          >
            <p className="text-[11px] font-medium text-stone-500">{l}</p>
            <p className="mt-0.5 truncate font-display text-[17px] font-bold text-[#2B221E]">
              {v}
            </p>
            <p className="text-[11px] text-stone-500">{sub}</p>
          </div>
        ))}
      </div>
      <RoomGrid
        rooms={s.rooms}
        onAction={onAction}
        onOpen={(r) => s.openDrawer(r.no)}
        cols="grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8"
      />
    </div>
  )
}
