/* eslint-disable @next/next/no-img-element */
import { UserPlus, Upload, BadgeCheck, UserCog, X } from "lucide-react"
import { useState } from "react"
import { useStore } from "@/store/store"
import { rupiah, TODAY, fmtDate } from "@/lib/data"
import { ModalShell, Field, SelectBox, MoneyInput, Btn, inputCls } from "../ui"

export default function CheckInModal({
  roomNo,
  tenantId,
  onClose,
}: {
  roomNo?: number
  tenantId?: string
  onClose: () => void
}) {
  const s = useStore()
  const editing = tenantId
    ? s.tenants.find((t) => t.id === tenantId)
    : undefined
  const vacant = s.rooms.filter((r) => r.status === "vacant")
  const [room, setRoom] = useState<number | "">(
    editing?.roomNo ?? roomNo ?? vacant[0]?.no ?? "",
  )
  const [name, setName] = useState(editing?.name ?? "")
  const [phone, setPhone] = useState(editing?.phone ?? "")
  const [ecName, setEcName] = useState(editing?.emergency.name ?? "")
  const [ecRel, setEcRel] = useState(editing?.emergency.rel ?? "Ibu Kandung")
  const [ecPhone, setEcPhone] = useState(editing?.emergency.phone ?? "")
  const [start, setStart] = useState(editing?.start ?? TODAY)
  const [deposit, setDeposit] = useState(1_000_000)
  const [method, setMethod] = useState("Tunai")
  const [ktp, setKtp] = useState<string | undefined>(editing?.ktp)
  const [ktpName, setKtpName] = useState("")
  const [touched, setTouched] = useState(false)

  const selected = s.rooms.find((r) => r.no === room)
  const errors = {
    room: !editing && !room ? "Pilih kamar kosong" : "",
    name: name.trim().length < 3 ? "Nama minimal 3 karakter" : "",
    phone:
      phone.replace(/\D/g, "").length < 9 ? "Nomor WhatsApp tidak valid" : "",
    ecName: !ecName.trim() ? "Wajib diisi" : "",
    ecPhone: ecPhone.replace(/\D/g, "").length < 9 ? "Nomor tidak valid" : "",
  }
  const valid = !Object.values(errors).some(Boolean)
  const err = (k: keyof typeof errors) => (touched ? errors[k] : "")

  const onFile = (f?: File) => {
    if (!f) return
    setKtpName(f.name)
    const reader = new FileReader()
    reader.onload = () => setKtp(String(reader.result))
    reader.readAsDataURL(f)
  }

  const save = () => {
    setTouched(true)
    if (!valid) return
    const emergency = { name: ecName.trim(), rel: ecRel, phone: ecPhone.trim() }
    if (editing) {
      s.updateTenant(editing.id, {
        name: name.trim(),
        phone: phone.trim(),
        emergency,
        ktp,
      })
      onClose()
      return
    }
    s.checkIn({
      roomNo: room as number,
      name: name.trim(),
      phone: phone.trim(),
      emergency,
      start,
      deposit,
      ktp,
      method,
    })
    onClose()
    s.openDrawer(room as number)
  }

  return (
    <ModalShell
      title={editing ? "Edit Data Penghuni" : "Check-In Penghuni Baru"}
      subtitle={
        editing
          ? `Kamar ${editing.roomNo} · mulai sewa ${fmtDate(editing.start)}`
          : `${s.property.name} · ${vacant.length} kamar siap huni`
      }
      icon={
        editing ? (
          <UserCog className="size-[18px]" />
        ) : (
          <UserPlus className="size-[18px]" />
        )
      }
      onClose={onClose}
      width={640}
      footer={
        <>
          {!editing && selected && (
            <p className="mr-auto text-[11.5px] text-slate-500">
              Diterima hari ini:{" "}
              <b className="text-slate-900 tabular-nums">
                {rupiah(selected.price + deposit)}
              </b>{" "}
              (sewa + deposit)
            </p>
          )}
          <Btn variant="secondary" onClick={onClose}>
            Batal
          </Btn>
          <Btn onClick={save} disabled={!editing && vacant.length === 0}>
            {editing ? "Simpan Perubahan" : "Simpan Penghuni"}
          </Btn>
        </>
      }
    >
      {!editing && vacant.length === 0 ? (
        <p className="px-5 py-10 text-center text-[13px] text-slate-500">
          Semua kamar sudah terisi. Tidak ada kamar kosong untuk check-in.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 px-5 py-4">
          <Field label="Pilih Kamar Kosong" error={err("room")}>
            <SelectBox
              value={room}
              disabled={!!editing}
              onChange={(v) => setRoom(Number(v))}
            >
              {editing ? (
                <option value={editing.roomNo ?? ""}>
                  Kamar {editing.roomNo}
                </option>
              ) : (
                vacant.map((r) => (
                  <option key={r.no} value={r.no}>
                    Kamar {r.no} · {r.type} · {rupiah(r.price)}/bln
                  </option>
                ))
              )}
            </SelectBox>
          </Field>
          <Field
            label="Tanggal Masuk"
            hint={
              !editing
                ? `Jatuh tempo bulanan: tgl ${Math.min(28, Number(start.slice(8, 10)))}`
                : undefined
            }
          >
            <input
              type="date"
              value={start}
              disabled={!!editing}
              onChange={(e) => setStart(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Nama Lengkap (sesuai KTP)" error={err("name")}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dimas Wahyu"
              className={inputCls}
            />
          </Field>
          <Field label="No. HP / WhatsApp" error={err("phone")}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              inputMode="tel"
              className={inputCls}
            />
          </Field>

          <div className="col-span-2 mt-1 rounded-xl border border-[#E6E2D8] p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Kontak Darurat
            </p>
            <div className="grid grid-cols-[1.2fr_0.9fr_1.1fr] gap-2">
              <Field label="Nama" error={err("ecName")}>
                <input
                  value={ecName}
                  onChange={(e) => setEcName(e.target.value)}
                  placeholder="Ibu Siti"
                  className={inputCls}
                />
              </Field>
              <Field label="Hubungan">
                <SelectBox value={ecRel} onChange={setEcRel}>
                  {[
                    "Ibu Kandung",
                    "Ayah Kandung",
                    "Saudara",
                    "Pasangan",
                    "Wali",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </SelectBox>
              </Field>
              <Field label="No. Telepon" error={err("ecPhone")}>
                <input
                  value={ecPhone}
                  onChange={(e) => setEcPhone(e.target.value)}
                  placeholder="0811-xxxx-xxxx"
                  inputMode="tel"
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {!editing && (
            <>
              <Field label="Nominal Uang Deposit Awal">
                <MoneyInput value={deposit} onChange={setDeposit} />
              </Field>
              <Field label="Metode Bayar (Sewa Bulan Pertama + Deposit)">
                <SelectBox value={method} onChange={setMethod}>
                  {["Tunai", "Transfer BCA", "Transfer Mandiri", "QRIS"].map(
                    (m) => (
                      <option key={m}>{m}</option>
                    ),
                  )}
                </SelectBox>
              </Field>
            </>
          )}

          <div className="col-span-2">
            <span className="mb-1 block text-[11.5px] font-medium text-slate-600">
              Upload Foto KTP
            </span>
            {ktp ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#C5DCD6] bg-[#EEF5F3] p-2.5">
                <img
                  src={ktp}
                  alt="Pratinjau KTP"
                  className="h-[72px] w-[114px] rounded-md object-cover ring-1 ring-[#C5DCD6]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-semibold text-[#1C2426]">
                    {ktpName || "Foto KTP tersimpan"}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <BadgeCheck className="size-3.5" /> Siap diverifikasi
                  </p>
                </div>
                <button
                  onClick={() => setKtp(undefined)}
                  className="flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-white"
                  aria-label="Hapus foto KTP"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-[#FAF8F5] py-5 text-[12.5px] font-medium text-slate-500 hover:border-[#1F5E53] hover:text-[#1F5E53]">
                <Upload className="size-4" /> Klik untuk pilih foto KTP
                (JPG/PNG)
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </label>
            )}
          </div>
        </div>
      )}
    </ModalShell>
  )
}
