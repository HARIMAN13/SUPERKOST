import {
  MessageCircle,
  FileSearch,
  Plus,
  Crown,
  LayoutGrid,
} from "lucide-react"
import { useState } from "react"
import { rupiah, type Room } from "@/lib/data"

type Filter = "all" | number | "overdue"

function RoomCard({
  r,
  onAction,
  onOpen,
}: {
  r: Room
  onAction: (r: Room) => void
  onOpen: (r: Room) => void
}) {
  if (r.status === "vacant") {
    return (
      <div className="flex min-h-[118px] flex-col rounded-[10px] border border-dashed border-[#D6D1C7] bg-[#F3F0EA] p-2.5">
        <p className="text-[12px] font-semibold text-stone-600">
          Kmr {r.no}{" "}
          <span className="font-normal text-stone-400">(Kosong)</span>
        </p>
        <p className="mt-1 text-[10.5px] text-stone-500">
          Siap Huni · {rupiah(r.price)}
        </p>
        <button
          onClick={() => onAction(r)}
          className="mt-auto flex h-6 items-center justify-center gap-1 rounded-md border border-[#E2D3C1] bg-white text-[10.5px] font-semibold text-[#8A6543] hover:bg-[#F6EFE6]"
        >
          <Plus className="size-3" strokeWidth={2.6} /> Check-In
        </button>
      </div>
    )
  }

  const s = {
    paid: {
      border: "border-[#E6E2D8]",
      bar: "bg-[#10B981]",
      tag: "bg-[#10B981]/10 text-emerald-700",
      label: `Lunas (Hingga ${r.paidUntil})`,
    },
    overdue: {
      border: "border-[#F43F5E]",
      bar: "bg-[#F43F5E]",
      tag: "bg-[#F43F5E]/10 text-rose-700",
      label: `Nunggak ${r.overdueDays} Hari`,
    },
    verify: {
      border: "border-[#F59E0B]",
      bar: "bg-[#F59E0B]",
      tag: "bg-[#F59E0B]/12 text-amber-700",
      label: "Verifikasi Transfer",
    },
  }[r.status]

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(r)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(r)}
      className={`relative flex min-h-[118px] cursor-pointer flex-col overflow-hidden rounded-[10px] border bg-white p-2.5 pt-3 text-left transition-shadow outline-none hover:shadow-md hover:shadow-stone-900/5 focus-visible:ring-2 focus-visible:ring-[#8A6543]/40 ${s.border}`}
    >
      <span className={`absolute inset-x-0 top-0 h-[3px] ${s.bar}`} />
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold text-[#2B221E]">
          Kmr {r.no}{" "}
          <span className="font-normal text-stone-400">({r.type})</span>
        </p>
        {r.vip && (
          <Crown
            className="size-3.5 text-[#C5A572]"
            strokeWidth={2}
            aria-label="VIP"
          />
        )}
      </div>
      <p className="mt-0.5 truncate text-[11.5px] text-stone-600">{r.tenant}</p>
      <span
        className={`mt-1.5 self-start rounded px-1.5 py-0.5 text-[10px] font-semibold ${s.tag}`}
      >
        {s.label}
      </span>
      <div className="mt-auto">
        {r.status === "paid" && (
          <p className="text-[11.5px] font-semibold text-[#2B221E] tabular-nums">
            {rupiah(r.price)}
          </p>
        )}
        {r.status === "overdue" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction(r)
            }}
            className="flex h-6 w-full items-center justify-center gap-1 rounded-md bg-[#F43F5E] text-[10.5px] font-semibold text-white hover:bg-[#E11D48]"
          >
            <MessageCircle className="size-3" strokeWidth={2.4} /> WA Tagihan
          </button>
        )}
        {r.status === "verify" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAction(r)
            }}
            className="flex h-6 w-full items-center justify-center gap-1 rounded-md border border-[#F59E0B] bg-[#F59E0B]/8 text-[10.5px] font-semibold text-amber-700 hover:bg-[#F59E0B]/15"
          >
            <FileSearch className="size-3" strokeWidth={2.2} /> Cek Bukti
          </button>
        )}
      </div>
    </div>
  )
}

export default function RoomGrid({
  rooms,
  onAction,
  onOpen,
  cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5",
}: {
  rooms: Room[]
  onAction: (r: Room) => void
  onOpen: (r: Room) => void
  cols?: string
}) {
  const [filter, setFilter] = useState<Filter>("all")
  const overdueCount = rooms.filter((r) => r.status === "overdue").length
  const floors = [...new Set(rooms.map((r) => r.floor))]
  const tabs: { k: Filter; label: string; n: number }[] = [
    { k: "all", label: "Semua", n: rooms.length },
    ...floors.map((f) => ({
      k: f,
      label: `Lantai ${f}`,
      n: rooms.filter((r) => r.floor === f).length,
    })),
    { k: "overdue", label: "Hanya Nunggak", n: overdueCount },
  ]
  const shown = rooms.filter((r) =>
    filter === "all"
      ? true
      : filter === "overdue"
        ? r.status === "overdue"
        : r.floor === filter,
  )

  return (
    <section className="rounded-xl border border-[#E6E2D8] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E2D8] px-4 py-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-[#8A6543]" strokeWidth={2} />
          <h2 className="whitespace-nowrap font-display text-[14px] font-bold text-[#2B221E]">
            Visualisasi Denah Kamar Real-Time
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-[#10B981]/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-[#10B981]" /> Live
          </span>
        </div>
        <div className="flex overflow-x-auto max-w-full rounded-lg bg-[#F3F0EA] p-0.5 scrollbar-none">
          {tabs.map((t) => {
            const on = filter === t.k
            const danger = t.k === "overdue"
            return (
              <button
                key={String(t.k)}
                onClick={() => setFilter(t.k)}
                className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                  on
                    ? danger
                      ? "bg-white text-rose-600 shadow-2xs"
                      : "bg-white text-[#2B221E] shadow-2xs"
                    : danger
                      ? "text-rose-500 hover:text-rose-600"
                      : "text-stone-500 hover:text-[#2B221E]"
                }`}
              >
                {t.label}{" "}
                <span className="tabular-nums opacity-70">({t.n})</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-4">
        {filter === "all" ? (
          <div className="space-y-3">
            {floors.map((f) => (
              <div key={f}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-stone-400">
                  Lantai {f}
                </p>
                <div className={`grid ${cols} gap-2`}>
                  {shown
                    .filter((r) => r.floor === f)
                    .map((r) => (
                      <RoomCard
                        key={r.no}
                        r={r}
                        onAction={onAction}
                        onOpen={onOpen}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : shown.length ? (
          <div className={`grid ${cols} gap-2`}>
            {shown.map((r) => (
              <RoomCard key={r.no} r={r} onAction={onAction} onOpen={onOpen} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-[12.5px] text-stone-500">
            Tidak ada kamar yang menunggak. Arus kas sehat.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4 border-t border-[#E6E2D8] pt-3 text-[11px] text-stone-500">
          {[
            ["bg-[#10B981]", "Terisi & Lunas"],
            ["bg-[#F43F5E]", "Nunggak"],
            ["bg-[#F59E0B]", "Verifikasi Transfer"],
            ["bg-[#E6E2D8]", "Kosong & Siap Huni"],
          ].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-sm ${c}`} /> {l}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-1.5">
            <Crown className="size-3 text-[#C5A572]" /> Penghuni VIP
          </span>
        </div>
      </div>
    </section>
  )
}
