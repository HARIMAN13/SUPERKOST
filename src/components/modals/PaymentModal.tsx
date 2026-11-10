import { Wallet, CheckCircle2, Printer, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import { rupiah, TODAY } from "@/lib/data"
import { ModalShell, Field, SelectBox, MoneyInput, Btn, inputCls } from "../ui"

export default function PaymentModal({
  roomNo,
  method: initialMethod,
  onClose,
}: {
  roomNo?: number
  method?: string
  onClose: () => void
}) {
  const s = useStore()
  const unpaid = s.rooms.filter(
    (r) => r.status === "overdue" || r.status === "verify",
  )
  const [room, setRoom] = useState<number | "">(roomNo ?? unpaid[0]?.no ?? "")
  const selected = s.rooms.find((r) => r.no === room)
  const [amount, setAmount] = useState(selected?.price ?? 0)
  const [method, setMethod] = useState(initialMethod ?? "Tunai")
  const [date, setDate] = useState(TODAY)
  const [sendWa, setSendWa] = useState(
    s.wa.rules.find((r) => r.id === "receipt")?.on ?? true,
  )
  const [done, setDone] = useState<string | null>(null)

  const pick = (no: number) => {
    setRoom(no)
    setAmount(s.rooms.find((r) => r.no === no)?.price ?? 0)
  }
  const save = () => {
    if (!selected || !amount) return
    setDone(
      s.recordPayment({ roomNo: selected.no, amount, method, date, sendWa }),
    )
  }

  if (done)
    return (
      <ModalShell
        title="Pembayaran Tercatat"
        icon={<CheckCircle2 className="size-[18px]" />}
        onClose={onClose}
        width={440}
      >
        <div className="px-6 py-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#10B981]/12">
            <CheckCircle2 className="size-6 text-[#10B981]" />
          </span>
          <p className="mt-3 font-display text-[22px] font-bold text-[#1E1B4B] tabular-nums">
            {rupiah(amount)}
          </p>
          <p className="text-[12.5px] text-slate-500">
            Kamar {selected?.no} · {selected?.tenant} · {method}
          </p>
          <p className="mt-2 text-[11.5px] text-emerald-700">
            Status tagihan diperbarui menjadi Lunas di semua modul
            {sendWa ? " · kuitansi dikirim via WA" : ""}.
          </p>
          <div className="mt-5 flex gap-2">
            <Btn variant="secondary" className="flex-1" onClick={onClose}>
              Selesai
            </Btn>
            <Btn
              className="flex-1"
              onClick={() =>
                s.openModal({
                  type: "doc",
                  doc: { kind: "receipt", invoiceId: done },
                })
              }
            >
              <Printer className="size-4" /> Cetak Kuitansi
            </Btn>
          </div>
        </div>
      </ModalShell>
    )

  return (
    <ModalShell
      title="Catat Pembayaran Sewa"
      subtitle="Tunai di kasir atau transfer yang sudah dicek manual"
      icon={<Wallet className="size-[18px]" />}
      onClose={onClose}
      width={520}
      footer={
        <>
          <Btn variant="secondary" onClick={onClose}>
            Batal
          </Btn>
          <Btn variant="success" onClick={save} disabled={!selected || !amount}>
            <CheckCircle2 className="size-4" /> Simpan & Tandai Lunas
          </Btn>
        </>
      }
    >
      {unpaid.length === 0 && !roomNo ? (
        <p className="px-5 py-10 text-center text-[13px] text-slate-500">
          Semua tagihan periode ini sudah lunas.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-5 py-4">
          <Field label="Kamar / Penghuni" className="col-span-2">
            <SelectBox value={room} onChange={(v) => pick(Number(v))}>
              {unpaid.map((r) => (
                <option key={r.no} value={r.no}>
                  Kamar {r.no} — {r.tenant} ·{" "}
                  {r.status === "overdue"
                    ? `Nunggak ${r.overdueDays} hari`
                    : "Menunggu verifikasi"}
                </option>
              ))}
            </SelectBox>
          </Field>
          <Field label="Nominal Diterima">
            <MoneyInput value={amount} onChange={setAmount} invalid={!amount} />
          </Field>
          <Field label="Metode">
            <SelectBox value={method} onChange={setMethod}>
              {[
                "Tunai",
                "Transfer BCA",
                "Transfer Mandiri",
                "Transfer BRI",
                "QRIS",
              ].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </SelectBox>
          </Field>
          <Field label="Tanggal Bayar">
            <input
              type="date"
              value={date}
              max={TODAY}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="flex items-end">
            <label className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg bg-[#F5F3FF] px-3 text-[12px] text-[#312E81]">
              <input
                type="checkbox"
                checked={sendWa}
                onChange={(e) => setSendWa(e.target.checked)}
                className="size-4 accent-[#4F46E5]"
              />{" "}
              Kirim kuitansi via WA
            </label>
          </div>
          {selected && amount !== selected.price && (
            <p className="col-span-2 flex items-center gap-1.5 rounded-lg bg-[#FFFBEB] px-3 py-2 text-[11.5px] text-amber-800">
              <AlertTriangle className="size-3.5" /> Nominal berbeda dari tarif
              sewa ({rupiah(selected.price)}). Pastikan sudah sesuai.
            </p>
          )}
        </div>
      )}
    </ModalShell>
  )
}
