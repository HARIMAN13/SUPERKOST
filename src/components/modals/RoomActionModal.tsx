import { Pencil, ArrowRightLeft } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import { rupiah } from "@/lib/data"
import { ModalShell, Field, SelectBox, MoneyInput, Btn } from "../ui"

export default function RoomActionModal({
  kind,
  roomNo,
  onClose,
}: {
  kind: "tarif" | "move"
  roomNo: number
  onClose: () => void
}) {
  const s = useStore()
  const room = s.rooms.find((r) => r.no === roomNo)
  const vacant = s.rooms.filter((r) => r.status === "vacant")
  const [price, setPrice] = useState(room?.price ?? 0)
  const [to, setTo] = useState<number | "">(vacant[0]?.no ?? "")
  if (!room) return null

  if (kind === "tarif")
    return (
      <ModalShell
        title={`Edit Tarif Kamar ${room.no}`}
        subtitle={`${room.type} · tarif saat ini ${rupiah(room.price)}/bulan`}
        icon={<Pencil className="size-[18px]" />}
        onClose={onClose}
        width={420}
        footer={
          <>
            <Btn variant="secondary" onClick={onClose}>
              Batal
            </Btn>
            <Btn
              disabled={!price || price === room.price}
              onClick={() => {
                s.setRoomPrice(room.no, price)
                onClose()
              }}
            >
              Simpan Tarif
            </Btn>
          </>
        }
      >
        <div className="space-y-2 px-5 py-4">
          <Field
            label="Tarif Sewa Baru / Bulan"
            hint={
              room.status !== "paid"
                ? "Tagihan berjalan yang belum lunas ikut diperbarui."
                : "Berlaku mulai tagihan periode berikutnya."
            }
          >
            <MoneyInput value={price} onChange={setPrice} />
          </Field>
        </div>
      </ModalShell>
    )

  return (
    <ModalShell
      title={`Pindahkan Penghuni Kamar ${room.no}`}
      subtitle={`${room.tenant} · tagihan & deposit ikut dipindahkan`}
      icon={<ArrowRightLeft className="size-[18px]" />}
      onClose={onClose}
      width={460}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>
            Batal
          </Btn>
          <Btn
            disabled={!to}
            onClick={() => {
              s.moveRoom(room.no, to as number)
              onClose()
            }}
          >
            Pindahkan
          </Btn>
        </>
      }
    >
      <div className="px-5 py-4">
        {vacant.length === 0 ? (
          <p className="py-6 text-center text-[12.5px] text-slate-500">
            Tidak ada kamar kosong sebagai tujuan.
          </p>
        ) : (
          <Field label="Kamar Tujuan (Kosong)">
            <SelectBox value={to} onChange={(v) => setTo(Number(v))}>
              {vacant.map((r) => (
                <option key={r.no} value={r.no}>
                  Kamar {r.no} · {r.type} · {rupiah(r.price)}/bln
                </option>
              ))}
            </SelectBox>
          </Field>
        )}
      </div>
    </ModalShell>
  )
}
