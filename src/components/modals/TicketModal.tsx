import { ClipboardList, Camera } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import { TODAY, fmtDate, type TicketCategory } from "@/lib/data"
import { VENDORS, JOBS, DEFAULT_COST } from "@/lib/vendors"
import { ModalShell, Field, SelectBox, MoneyInput, Btn, inputCls } from "../ui"

const CATS: TicketCategory[] = [
  "AC",
  "Pompa Air & Ledeng",
  "Listrik",
  "Bangunan & Lainnya",
]

export default function TicketModal({
  roomNo,
  category,
  onClose,
}: {
  roomNo?: number | null
  category?: TicketCategory
  onClose: () => void
}) {
  const s = useStore()
  const [cat, setCat] = useState<TicketCategory>(category ?? "AC")
  const [room, setRoom] = useState<number>(
    roomNo ?? s.stats.acOverdue[0]?.room ?? s.rooms[0].no,
  )
  const [job, setJob] = useState(JOBS[cat][0])
  const vendorFor = (c: TicketCategory) =>
    VENDORS.find((v) => v.categories.includes(c))?.name ?? VENDORS[0].name
  const [vendor, setVendor] = useState(vendorFor(cat))
  const [date, setDate] = useState("2026-11-07")
  const [cost, setCost] = useState(DEFAULT_COST[cat])
  const [note, setNote] = useState("")
  const [photo, setPhoto] = useState("")
  const [sendWa, setSendWa] = useState(true)

  const changeCat = (c: TicketCategory) => {
    setCat(c)
    setJob(JOBS[c][0])
    setVendor(vendorFor(c))
    setCost(DEFAULT_COST[c])
  }
  const unit = s.units.find((u) => u.room === room)

  return (
    <ModalShell
      title="Lapor Kerusakan / Buat Tiket Servis"
      subtitle={
        cat === "AC" && room && unit
          ? `Kamar ${room} · ${unit.brand} ${unit.pk} · terakhir servis ${fmtDate(unit.last)}`
          : s.property.name
      }
      icon={<ClipboardList className="size-[18px]" />}
      onClose={onClose}
      width={600}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>
            Batal
          </Btn>
          <Btn
            disabled={!date || !cost}
            onClick={() => {
              s.createTicket(
                {
                  room: room || null,
                  category: cat,
                  job,
                  vendor,
                  date,
                  cost,
                  note: [note, photo && `Foto: ${photo}`]
                    .filter(Boolean)
                    .join(" · "),
                },
                sendWa,
              )
              onClose()
            }}
          >
            Buat Tiket & Jadwalkan
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 px-5 py-4">
        <div className="col-span-2 flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => changeCat(c)}
              className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold ${
                cat === c
                  ? "border-[#1F5E53] bg-[#EEF5F3] text-[#1F5E53]"
                  : "border-[#E6E2D8] text-slate-600 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <Field label="Lokasi">
          <SelectBox value={room} onChange={(v) => setRoom(Number(v))}>
            {cat !== "AC" && (
              <option value={0}>Area Umum / Fasilitas Bersama</option>
            )}
            {s.rooms.map((r) => (
              <option key={r.no} value={r.no}>
                Kamar {r.no}
                {r.tenant ? ` — ${r.tenant}` : " (kosong)"}
              </option>
            ))}
          </SelectBox>
        </Field>
        <Field label="Jenis Pekerjaan">
          <SelectBox value={job} onChange={setJob}>
            {JOBS[cat].map((j) => (
              <option key={j}>{j}</option>
            ))}
          </SelectBox>
        </Field>
        <Field label="Vendor / Teknisi">
          <SelectBox value={vendor} onChange={setVendor}>
            {VENDORS.map((v) => (
              <option key={v.name}>{v.name}</option>
            ))}
          </SelectBox>
        </Field>
        <Field label="Tanggal Kunjungan">
          <input
            type="date"
            value={date}
            min={TODAY}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field
          label="Estimasi Biaya"
          hint="Dicatat ke Buku Kas saat tiket ditandai selesai"
        >
          <MoneyInput value={cost} onChange={setCost} />
        </Field>
        <Field label="Catatan untuk Teknisi">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Mis. AC netes, penghuni ada pukul 10.00"
            className={inputCls}
          />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[12px] text-slate-500 hover:border-[#1F5E53] hover:text-[#1F5E53]">
          <Camera className="size-4" />{" "}
          <span className="truncate">
            {photo || "Lampirkan foto kerusakan (opsional)"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? "")}
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#EEF5F3] px-3 py-2 text-[12px] text-[#1F5E53]">
          <input
            type="checkbox"
            checked={sendWa}
            onChange={(e) => setSendWa(e.target.checked)}
            className="size-4 accent-[#1F5E53]"
          />{" "}
          Kirim detail ke vendor via WA
        </label>
      </div>
    </ModalShell>
  )
}
