import {
  X,
  Vault,
  Plus,
  Camera,
  Trash2,
  Landmark,
  CreditCard,
  Printer,
  Loader2,
  Calculator,
  ShieldCheck,
  ChevronDown,
  Info,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { rupiah, fmtDate, monthsBetween, type Room } from "@/lib/data"
import { useStore } from "@/store/store"

type Tone = "danger" | "warn" | "ok"
interface Item {
  id: number
  name: string
  cond: string
  tone: Tone
  amount: number
  charged: boolean
  custom?: boolean
  photo?: string
}

const SEED: Omit<Item, "id">[] = [
  {
    name: "Duplikat Kunci Pintu Kamar",
    cond: "Hilang / Tidak Kembali",
    tone: "danger",
    amount: 50_000,
    charged: true,
  },
  {
    name: "Dinding Kamar Tidur",
    cond: "Baret & Perlu Cat Ulang",
    tone: "warn",
    amount: 150_000,
    charged: true,
  },
  {
    name: "Remote AC & Unit Pendingin",
    cond: "Lengkap & Normal",
    tone: "ok",
    amount: 0,
    charged: false,
  },
  {
    name: "Kasur & Dipan Springbed",
    cond: "Bersih & Utuh",
    tone: "ok",
    amount: 0,
    charged: false,
  },
]

const BANKS = ["Bank Mandiri", "BCA", "BRI", "BNI", "BSI", "CIMB Niaga"]

const toneCls: Record<Tone, string> = {
  danger: "bg-[#F43F5E]/10 text-rose-700 ring-[#F43F5E]/25",
  warn: "bg-[#F59E0B]/12 text-amber-700 ring-[#F59E0B]/30",
  ok: "bg-[#10B981]/10 text-emerald-700 ring-[#10B981]/25",
}

const fmt = (n: number) => (n ? n.toLocaleString("id-ID") : "")
const parse = (s: string) => Number(s.replace(/\D/g, "").slice(0, 9)) || 0

function Step({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="flex size-5 items-center justify-center rounded-full bg-[#8A6543] text-[10.5px] font-bold text-white">
        {n}
      </span>
      <p className="text-[12.5px] font-semibold text-[#2B221E]">{title}</p>
      {hint && <p className="text-[11.5px] text-slate-400">· {hint}</p>}
    </div>
  )
}

export default function CheckoutModal({
  room,
  onClose,
  onConfirm,
}: {
  room: Room | null
  onClose: () => void
  onConfirm: (
    r: Room,
    refund: number,
    c: {
      deductions: { name: string; amount: number }[]
      bank: string
      account: string
    },
  ) => void
}) {
  const [shown, setShown] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [bank, setBank] = useState("Bank Mandiri")
  const [account, setAccount] = useState("")
  const [busy, setBusy] = useState(false)
  const [touched, setTouched] = useState(false)
  const nextId = useRef(100)
  const store = useStore()
  const tenant = room
    ? store.tenants.find((t) => t.id === room.tenantId)
    : undefined
  const deposit = room
    ? store.deposits.find(
        (x) => x.tenantId === room.tenantId && x.status !== "refunded",
      )
    : undefined

  useEffect(() => {
    if (!room) return
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation()
        onClose()
      }
    }
    window.addEventListener("keydown", k, true)
    return () => window.removeEventListener("keydown", k, true)
  }, [room, onClose])

  useEffect(() => {
    if (!room) {
      setShown(false)
      return
    }
    setItems(SEED.map((s, i) => ({ ...s, id: i })))
    const b = tenant?.bank ?? "BCA"
    setBank(
      room.no === 204 ? "Bank Mandiri" : b === "Mandiri" ? "Bank Mandiri" : b,
    )
    setAccount(
      room.no === 204 && room.tenant === "Dimas Wahyu"
        ? "142-00-1234567-8 a/n Dimas Wahyu"
        : `a/n ${room.tenant ?? ""}`,
    )
    setBusy(false)
    setTouched(false)
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [room?.no, room?.tenantId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!room) return null
  const d = {
    start: tenant ? fmtDate(tenant.start) : "-",
    deposit: deposit?.amount ?? 0,
  }
  const tenure = Math.max(1, tenant ? monthsBetween(tenant.start) : 1)
  const deductions = items.reduce((s, i) => s + (i.charged ? i.amount : 0), 0)
  const refund = d.deposit - deductions
  const accountOk = /\d{6,}/.test(account.replace(/\D/g, ""))

  const patch = (id: number, p: Partial<Item>) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...p } : x)))
  const addItem = () =>
    setItems((xs) => [
      ...xs,
      {
        id: nextId.current++,
        name: "",
        cond: "Rusak / Perlu Perbaikan",
        tone: "danger",
        amount: 0,
        charged: true,
        custom: true,
      },
    ])

  const confirm = () => {
    setTouched(true)
    if (!accountOk) return
    setBusy(true)
    window.setTimeout(
      () =>
        onConfirm(room, refund, {
          deductions: items
            .filter((i) => i.charged && i.amount)
            .map((i) => ({
              name: i.name || "Kerusakan lain",
              amount: i.amount,
            })),
          bank,
          account,
        }),
      700,
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Formulir Pelepasan Kamar & Clearance Deposit"
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-[#332924]/55 backdrop-blur-[4px] transition-opacity duration-200 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative flex max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl border border-[#E6E2D8] bg-white shadow-2xl shadow-stone-950/30 transition-all duration-200 ${
          shown
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        {/* Header */}
        <header className="flex items-start gap-3 bg-gradient-to-r from-[#332924] to-[#453730] px-6 py-4">
          <span className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-white/10 text-stone-200 ring-1 ring-white/10">
            <ShieldCheck className="size-[18px]" strokeWidth={1.9} />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-[17px] font-bold tracking-tight text-white">
              Formulir Pelepasan Kamar & Clearance Deposit
            </h2>
            <p className="mt-0.5 text-[12px] text-stone-300">
              Kamar {room.no} <span className="text-[#C5A572]">•</span>{" "}
              Penghuni: {room.tenant} <span className="text-[#C5A572]">•</span>{" "}
              Masa Sewa: {tenure} Bulan
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-8 items-center justify-center rounded-lg text-stone-300 hover:bg-white/10 hover:text-white"
          >
            <X className="size-[18px]" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Step 1 */}
          <section>
            <Step n={1} title="Status Deposit Awal" />
            <div className="flex items-center gap-3.5 rounded-xl border border-[#E6E2D8] px-4 py-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#F6EFE6] text-[#8A6543] ring-1 ring-[#E2D3C1]">
                <Vault className="size-5" strokeWidth={1.9} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-slate-800">
                  Total Uang Jaminan (Deposit) Masuk Awal
                </p>
                <p className="text-[11.5px] text-slate-500">
                  Disetor saat check-in {d.start} via Transfer Bank
                </p>
              </div>
              <p className="font-display text-[18px] font-bold text-[#2B221E] tabular-nums">
                {rupiah(d.deposit)}
              </p>
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <Step
              n={2}
              title="Rincian Potongan Kerusakan"
              hint="Isi nominal sesuai kondisi saat inspeksi keluar"
            />
            <div className="overflow-hidden rounded-xl border border-[#E6E2D8]">
              <table className="w-full text-[12.5px]">
                <thead className="bg-[#FAF8F5] text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <tr className="border-b border-[#E6E2D8]">
                    <th className="px-4 py-2">Jenis Inventaris / Kerusakan</th>
                    <th className="py-2 pr-3">Kondisi Fisik Saat Keluar</th>
                    <th className="w-[200px] py-2 pr-4 text-right">
                      Nominal Potongan (Rp)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E2D8]">
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td className="px-4 py-2.5">
                        {it.custom ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                setItems((xs) =>
                                  xs.filter((x) => x.id !== it.id),
                                )
                              }
                              aria-label="Hapus item"
                              className="text-slate-300 hover:text-rose-500"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                            <input
                              autoFocus
                              value={it.name}
                              onChange={(e) =>
                                patch(it.id, { name: e.target.value })
                              }
                              placeholder="Nama item / kerusakan"
                              className="h-8 w-full rounded-md border border-[#E6E2D8] px-2 text-[12.5px] outline-none focus:border-[#8A6543] focus:ring-3 focus:ring-[#8A6543]/15"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-slate-800">
                            {it.name}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${toneCls[it.tone]}`}
                          >
                            {it.cond}
                          </span>
                          {it.custom && (
                            <label className="flex cursor-pointer items-center gap-1 rounded-md border border-dashed border-slate-300 px-1.5 py-0.5 text-[10.5px] font-medium text-slate-500 hover:border-[#8A6543] hover:text-[#8A6543]">
                              <Camera className="size-3" />
                              <span className="max-w-[90px] truncate">
                                {it.photo ?? "Foto bukti"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  patch(it.id, {
                                    photo: e.target.files?.[0]?.name,
                                  })
                                }
                              />
                            </label>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-right">
                        {it.charged ? (
                          <div className="relative ml-auto w-[150px]">
                            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[11.5px] font-medium text-slate-400">
                              Rp
                            </span>
                            <input
                              inputMode="numeric"
                              value={fmt(it.amount)}
                              onChange={(e) =>
                                patch(it.id, { amount: parse(e.target.value) })
                              }
                              placeholder="0"
                              className="h-8 w-full rounded-md border border-[#E6E2D8] pl-8 pr-2.5 text-right text-[12.5px] font-semibold text-rose-600 tabular-nums outline-none placeholder:text-slate-300 focus:border-[#8A6543] focus:ring-3 focus:ring-[#8A6543]/15"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              patch(it.id, {
                                charged: true,
                                tone: "warn",
                                cond: "Perlu Perbaikan",
                              })
                            }
                            title="Klik untuk menambahkan potongan"
                            className="text-[12px] text-slate-400 hover:text-[#8A6543]"
                          >
                            0 (Tanpa Potongan)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={addItem}
                className="flex w-full items-center gap-1.5 border-t border-dashed border-[#E6E2D8] px-4 py-2.5 text-[12px] font-semibold text-[#8A6543] hover:bg-[#F6EFE6]"
              >
                <Plus className="size-3.5" strokeWidth={2.6} /> Tambah Item
                Kerusakan Fisik Lainnya
                <span className="flex items-center gap-1 font-medium text-slate-400">
                  (<Camera className="size-3" /> Upload Foto Bukti)
                </span>
              </button>
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <Step n={3} title="Kalkulasi Settlement Otomatis" />
            <div className="grid grid-cols-[1fr_auto_1.1fr] items-center gap-5 rounded-xl border border-[#E2D3C1] bg-[#F6EFE6] px-5 py-4">
              <dl className="space-y-2 text-[12.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">Deposit Awal</dt>
                  <dd className="font-semibold text-[#2B221E] tabular-nums">
                    {rupiah(d.deposit)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">
                    Total Biaya Perbaikan Fisik
                  </dt>
                  <dd className="font-semibold text-[#F43F5E] tabular-nums">
                    - {rupiah(deductions)}
                  </dd>
                </div>
                <p className="flex items-center gap-1 pt-0.5 text-[10.5px] text-[#8A6543]/80">
                  <Calculator className="size-3" />{" "}
                  {items.filter((i) => i.charged && i.amount).length} item
                  dipotong · dihitung real-time
                </p>
              </dl>
              <span className="h-full w-px bg-[#E2D3C1]" />
              <div>
                <p className="text-[11.5px] font-medium text-[#8A6543]">
                  {refund >= 0
                    ? "Sisa Uang Jaminan yang Wajib Dikembalikan:"
                    : "Kekurangan yang Ditagihkan ke Penghuni:"}
                </p>
                <p
                  className={`mt-0.5 font-display text-[26px] font-bold leading-tight tabular-nums ${
                    refund >= 0 ? "text-[#10B981]" : "text-[#F43F5E]"
                  }`}
                >
                  {rupiah(Math.abs(refund))}
                </p>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <Step n={4} title="Rekening Tujuan Pengembalian" />
            <div className="grid grid-cols-[0.8fr_1.2fr] gap-3">
              <label className="block">
                <span className="mb-1 block text-[11.5px] font-medium text-slate-600">
                  Bank Tujuan
                </span>
                <div className="relative">
                  <Landmark className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-[#E6E2D8] bg-white pl-9 pr-8 text-[12.5px] font-medium text-slate-800 outline-none focus:border-[#8A6543] focus:ring-3 focus:ring-[#8A6543]/15"
                  >
                    {BANKS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-[11.5px] font-medium text-slate-600">
                  Nomor Rekening & A/N
                </span>
                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="Contoh: 142-00-1234567-8 a/n Nama Penghuni"
                    className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-[12.5px] font-medium text-slate-800 tabular-nums outline-none focus:ring-3 ${
                      touched && !accountOk
                        ? "border-[#F43F5E] focus:ring-[#F43F5E]/15"
                        : "border-[#E6E2D8] focus:border-[#8A6543] focus:ring-[#8A6543]/15"
                    }`}
                  />
                </div>
                {touched && !accountOk && (
                  <span className="mt-1 block text-[11px] text-rose-600">
                    Masukkan nomor rekening yang valid.
                  </span>
                )}
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex items-center gap-3 border-t border-[#E6E2D8] bg-[#FAF8F5] px-6 py-3.5">
          <button
            onClick={onClose}
            className="h-10 rounded-lg border border-[#E6E2D8] bg-white px-5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Batal
          </button>
          <p className="flex flex-1 items-center gap-1.5 text-[11px] text-slate-500">
            <Info className="size-3.5 shrink-0 text-slate-400" /> Berita acara
            ditandatangani digital & dikirim ke WA penghuni.
          </p>
          <button
            onClick={confirm}
            disabled={busy}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#8A6543] px-4 text-[12.5px] font-semibold text-white hover:bg-[#8A6543] disabled:opacity-80"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Printer className="size-4" />
            )}
            Konfirmasi Pengembalian & Cetak Berita Acara PDF
          </button>
        </footer>
      </div>
    </div>
  )
}
