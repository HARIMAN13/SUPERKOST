import {
  MessageSquareText,
  ShieldCheck,
  Megaphone,
  CheckCheck,
  Check,
  Clock,
  Zap,
  Users,
  Save,
  RotateCcw,
  Search,
  X,
  Loader2,
  Send,
  Server,
  Radio,
  Eye,
  AlertCircle,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  QUOTA,
  shortName,
  type Rule,
  type RuleId,
  type WhatsAppState,
} from "@/lib/wa"
import type { Room } from "@/lib/data"

const NOW = "10:52"

const TAGS = [
  "nama_penghuni",
  "nomor_kamar",
  "nominal_tagihan",
  "tanggal_jatuh_tempo",
  "rekening_bank",
]
const SAMPLE: Record<string, string> = {
  nama_penghuni: "Dimas",
  nomor_kamar: "204",
  nominal_tagihan: "1.500.000",
  tanggal_jatuh_tempo: "10 Nov 2026",
  rekening_bank: "BCA 1234567890 a/n Muhamad Maulana Rizki",
}
const render = (t: string) => t.replace(/\{(\w+)\}/g, (m, k) => SAMPLE[k] ?? m)

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        on ? "bg-[#8A6543]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
          on ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  )
}

export default function WhatsAppPage({
  wa,
  rooms,
  notify,
}: {
  wa: WhatsAppState
  rooms: Room[]
  notify: (m: string) => void
}) {
  const { rules, setRules, outbox, used, push } = wa
  const [active, setActive] = useState<RuleId>("h3")
  const rule = rules.find((r) => r.id === active)!
  const [draft, setDraft] = useState(rule.template)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const [q, setQ] = useState("")
  const [broadcast, setBroadcast] = useState(false)

  useEffect(() => {
    const found = rules.find((r) => r.id === active)
    if (found) setDraft(found.template)
  }, [active, rules])

  const overdue = rooms.filter((r) => r.status === "overdue").length
  const occupied = rooms.filter((r) => r.status !== "vacant").length
  const targets: Record<RuleId, string> = {
    h3: "6 Kamar",
    h0: "2 Kamar",
    late: `${overdue} Kamar`,
    receipt: "Instan saat approval",
  }

  const patchRule = (id: RuleId, p: Partial<Rule>) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)))

  const insertTag = (tag: string) => {
    const ta = taRef.current
    const token = `{${tag}}`
    const start = ta?.selectionStart ?? draft.length
    const end = ta?.selectionEnd ?? draft.length
    const next = draft.slice(0, start) + token + draft.slice(end)
    setDraft(next)
    requestAnimationFrame(() => {
      ta?.focus()
      ta?.setSelectionRange(start + token.length, start + token.length)
    })
  }

  const dirty = draft !== rule.template
  const pct = Math.min(100, (used / QUOTA) * 100)
  const remaining = QUOTA - used

  const shown = outbox.filter(
    (m) =>
      !q ||
      `${m.room ?? ""} ${m.name} ${m.tpl}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  )
  const read = outbox.filter((m) => m.status === "read").length
  const delivered = outbox.filter((m) => m.status !== "sending").length

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11.5px] font-medium text-slate-500">
            Mesin WhatsApp Gateway <span className="text-slate-300">/</span>{" "}
            Otomasi & Outbox
          </p>
          <h1 className="mt-0.5 font-display text-[21px] font-bold tracking-tight text-[#2B221E]">
            Pusat Otomasi Notifikasi WhatsApp & Gateway
          </h1>
        </div>
        <p className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
          <Clock className="size-3.5" /> Server time {NOW} WIB · Cron berikutnya
          besok 08:00 WIB
        </p>
      </div>

      {/* Gateway status bar */}
      <section className="flex items-center gap-5 rounded-xl border border-[#E6E2D8] bg-white px-4 py-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-[#F6EFE6] text-[#8A6543] ring-1 ring-[#E2D3C1]">
          <MessageSquareText className="size-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
            WhatsApp Gateway Connected
            <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-inset ring-[#10B981]/25">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#10B981] opacity-70" />
                <span className="relative size-1.5 rounded-full bg-[#10B981]" />
              </span>
              Online
            </span>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-slate-500">
            <Server className="size-3.5 text-[#8A6543]" /> Fonnte API{" "}
            <span className="text-slate-300">•</span> Node ID: SBY-01
          </p>
        </div>
        <span className="h-9 w-px bg-[#E2E8F0]" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-500">Status Nomor</p>
          <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-900">
            <span className="tabular-nums">0812-9988-7766</span>
            <span className="font-normal text-slate-500">
              (Superkost Official Bot •
            </span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700">
              <ShieldCheck className="size-3.5" /> Verified
            </span>
            <span className="-ml-1 font-normal text-slate-500">)</span>
          </p>
        </div>
        <div className="ml-auto w-[280px]">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-medium text-slate-500">
              Kuota Pesan Bulan Ini
            </p>
            <p className="text-[12px] text-slate-500 tabular-nums">
              <b className="font-semibold text-slate-900">
                {used.toLocaleString("id-ID")}
              </b>{" "}
              / {QUOTA.toLocaleString("id-ID")} Pesan Terpakai
            </p>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F3F0EA]">
            <div
              className={`h-full rounded-full transition-all ${
                pct >= 95
                  ? "bg-[#F43F5E]"
                  : pct >= 85
                    ? "bg-[#F59E0B]"
                    : "bg-[#8A6543]"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-[10.5px] text-slate-400">
            Sisa {remaining.toLocaleString("id-ID")} pesan · reset 1 Des 2026
          </p>
        </div>
      </section>

      <div className="grid h-[calc(100vh-292px)] min-h-[560px] grid-cols-[minmax(0,40fr)_minmax(0,60fr)] gap-4">
        {/* LEFT: rules + editor */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
          <div className="flex items-center justify-between border-b border-[#E6E2D8] px-4 py-3">
            <h2 className="font-display text-[13.5px] font-bold text-[#2B221E]">
              Aturan Penagihan Otomatis (Cron Job Harian)
            </h2>
            <span className="rounded-full bg-[#F6EFE6] px-2 py-0.5 text-[10.5px] font-semibold text-[#8A6543]">
              {rules.filter((r) => r.on).length}/4 Aktif
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ul className="space-y-1.5 p-3">
              {rules.map((r) => {
                const sel = r.id === active
                return (
                  <li key={r.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setActive(r.id)}
                      onKeyDown={(e) => e.key === "Enter" && setActive(r.id)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                        sel
                          ? "border-[#E2D3C1] bg-[#F6EFE6]"
                          : "border-[#E6E2D8] hover:bg-slate-50"
                      } ${r.on ? "" : "opacity-60"}`}
                    >
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
                          sel
                            ? "bg-white text-[#8A6543]"
                            : "bg-[#FAF8F5] text-slate-500"
                        }`}
                      >
                        {r.time ? (
                          <Clock className="size-4" strokeWidth={1.9} />
                        ) : (
                          <Zap className="size-4" strokeWidth={1.9} />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12.5px] font-semibold text-slate-900">
                          {r.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-500">
                          {r.time ? (
                            <select
                              value={r.time}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                patchRule(r.id, { time: e.target.value })
                              }
                              className="rounded border border-transparent bg-transparent font-medium text-slate-700 outline-none hover:border-[#E6E2D8] focus:border-[#8A6543]"
                            >
                              {[
                                "07:00",
                                "08:00",
                                "09:00",
                                "10:00",
                                "11:00",
                                "12:00",
                              ].map((t) => (
                                <option key={t} value={t}>
                                  {t} WIB
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-medium text-[#8A6543]">
                              Instant Trigger
                            </span>
                          )}
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />{" "}
                            {r.time
                              ? `Target: ${targets[r.id]}`
                              : "Saat pembayaran disetujui"}
                          </span>
                        </div>
                      </div>
                      <Toggle
                        on={r.on}
                        label={r.name}
                        onChange={() => {
                          patchRule(r.id, { on: !r.on })
                          notify(
                            `${r.name} ${
                              r.on ? "dinonaktifkan" : "diaktifkan"
                            }`,
                          )
                        }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>

            {/* Template editor */}
            <div className="border-t border-[#E6E2D8] p-4">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-semibold text-[#2B221E]">
                  Editor Template Dinamis
                </p>
                <span className="rounded bg-[#F6EFE6] px-1.5 py-0.5 text-[10.5px] font-semibold text-[#8A6543]">
                  {rule.tag}
                </span>
              </div>
              <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Sisipkan variabel
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => insertTag(t)}
                    className="rounded-md border border-[#E2D3C1] bg-[#F6EFE6] px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-[#8A6543] hover:border-[#8A6543] hover:bg-[#ECE5D8]"
                  >
                    {`{${t}}`}
                  </button>
                ))}
              </div>
              <textarea
                ref={taRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
                className="mt-2.5 w-full resize-none rounded-lg border border-[#E6E2D8] bg-[#FAF8F5] px-3 py-2 text-[12px] leading-relaxed text-slate-800 outline-none focus:border-[#8A6543] focus:bg-white focus:ring-3 focus:ring-[#8A6543]/15"
              />
              <div className="mt-1 flex justify-between text-[10.5px] text-slate-400">
                <span>{draft.length} karakter</span>
                <span>{dirty ? "Belum disimpan" : "Tersimpan"}</span>
              </div>

              <p className="mt-2 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                <Eye className="size-3" /> Pratinjau (Kmr 204)
              </p>
              <div className="mt-1.5 rounded-lg bg-[#EFEAE2] p-2.5">
                <div className="ml-auto max-w-[92%] rounded-lg rounded-tr-sm bg-[#D9FDD3] px-2.5 py-1.5 text-[11.5px] leading-snug text-slate-800 shadow-sm">
                  {render(draft)}
                  <span className="mt-0.5 flex items-center justify-end gap-0.5 text-[9.5px] text-slate-500">
                    {rule.time ?? NOW}{" "}
                    <CheckCheck className="size-3 text-[#10B981]" />
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setDraft(rule.template)}
                  disabled={!dirty}
                  className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E6E2D8] px-3 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <RotateCcw className="size-3.5" /> Reset
                </button>
                <button
                  onClick={() => {
                    patchRule(rule.id, { template: draft })
                    notify(`Template "${rule.name}" disimpan`)
                  }}
                  disabled={!dirty}
                  className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#8A6543] text-[12px] font-semibold text-white hover:bg-[#735335] disabled:opacity-40"
                >
                  <Save className="size-3.5" /> Simpan Template
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: outbox */}
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#E6E2D8] bg-white">
          <div className="flex items-center gap-3 border-b border-[#E6E2D8] px-4 py-3">
            <h2 className="font-display text-[13.5px] font-bold text-[#2B221E]">
              Antrean Pesan Terkirim Hari Ini (Real-Time Outbox)
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-[#10B981]/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              <Radio className="size-3" /> Live
            </span>
            <button
              onClick={() => setBroadcast(true)}
              className="ml-auto flex h-9 items-center gap-1.5 rounded-lg bg-[#F59E0B] px-3 text-[12px] font-semibold text-[#2B221E] hover:bg-[#D97706] hover:text-white"
            >
              <Megaphone className="size-4" strokeWidth={2} /> Broadcast
              Pengumuman Massal (Semua Penghuni)
            </button>
          </div>

          <div className="grid grid-cols-4 border-b border-[#E6E2D8]">
            {[
              ["Total Pesan Hari Ini", outbox.length, "text-[#2B221E]"],
              ["Terkirim", delivered, "text-emerald-700"],
              ["Terbaca", read, "text-[#8A6543]"],
              ["Gagal", 0, "text-slate-400"],
            ].map(([l, v, c], i) => (
              <div
                key={l as string}
                className={`px-4 py-2 ${i ? "border-l border-[#E6E2D8]" : ""}`}
              >
                <p className="text-[10.5px] text-slate-500">{l}</p>
                <p
                  className={`font-display text-[16px] font-bold tabular-nums ${c}`}
                >
                  {v as number}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-[11.5px] text-slate-500">
              Read rate{" "}
              <b className="font-semibold text-slate-800">
                {Math.round((read / Math.max(1, delivered)) * 100)}%
              </b>{" "}
              · rata-rata dibaca 14 menit
            </p>
            <div className="relative w-[200px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari kamar / template"
                className="h-8 w-full rounded-lg border border-[#E6E2D8] bg-[#FAF8F5] pl-8 pr-2 text-[12px] outline-none placeholder:text-slate-400 focus:border-[#8A6543] focus:bg-white"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto border-t border-[#E6E2D8]">
            <table className="w-full text-[12.5px]">
              <thead className="sticky top-0 z-10 bg-[#FAF8F5] text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500 shadow-[0_1px_0_#E6E2D8]">
                <tr>
                  <th className="px-4 py-2">Waktu</th>
                  <th className="py-2 pr-3">Penerima</th>
                  <th className="py-2 pr-3">Template</th>
                  <th className="py-2 pr-3">Kanal</th>
                  <th className="px-4 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E2D8]">
                {shown.map((m) => (
                  <tr
                    key={m.id}
                    className={
                      m.status === "sending"
                        ? "bg-[#FFFBEB]"
                        : "hover:bg-slate-50"
                    }
                  >
                    <td className="px-4 py-2.5 font-medium text-slate-700 tabular-nums">
                      {m.time} WIB
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="font-semibold text-slate-900">
                        {m.room ? `Kamar ${m.room}` : "Semua Penghuni"}
                      </span>{" "}
                      <span className="text-slate-500">({m.name})</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10.5px] font-semibold ${
                          m.tpl === "Broadcast"
                            ? "bg-[#F59E0B]/12 text-amber-700"
                            : "bg-[#F6EFE6] text-[#8A6543]"
                        }`}
                      >
                        {m.tpl}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-[11.5px] text-slate-500">
                      Fonnte · SBY-01
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {m.status === "sending" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F59E0B]/12 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700">
                          <Loader2 className="size-3 animate-spin" /> Mengirim…
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/10 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-inset ring-[#10B981]/25">
                          {m.status === "read"
                            ? "Terkirim & Terbaca"
                            : "Terkirim"}
                          <CheckCheck
                            className={`size-3.5 ${
                              m.status === "read"
                                ? "text-[#8A6543]"
                                : "text-emerald-600"
                            }`}
                            strokeWidth={2.4}
                          />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && (
              <p className="py-12 text-center text-[12.5px] text-slate-500">
                Tidak ada pesan yang cocok.
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 border-t border-[#E6E2D8] px-4 py-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCheck className="size-3.5 text-emerald-600" /> Terkirim ke
              perangkat
            </span>
            <span className="flex items-center gap-1">
              <CheckCheck className="size-3.5 text-[#8A6543]" /> Dibaca penghuni
            </span>
            <span className="ml-auto">Log disimpan 90 hari untuk audit</span>
          </div>
        </section>
      </div>

      {broadcast && (
        <BroadcastDialog
          recipients={occupied}
          remaining={remaining}
          onClose={() => setBroadcast(false)}
          onSend={() => {
            const time = new Date()
              .toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              })
              .replace(".", ":")
            push(
              rooms
                .filter((r) => r.status !== "vacant")
                .map((r) => ({
                  time,
                  room: r.no,
                  name: shortName(r.tenant),
                  tpl: "Broadcast",
                })),
            )
            setBroadcast(false)
            notify(`Broadcast dikirim ke ${occupied} penghuni`)
          }}
        />
      )}
    </div>
  )
}

function BroadcastDialog({
  recipients,
  remaining,
  onClose,
  onSend,
}: {
  recipients: number
  remaining: number
  onClose: () => void
  onSend: () => void
}) {
  const [text, setText] = useState(
    "Info Penghuni: Akan ada pemeliharaan pompa air pada Sabtu, 8 Nov 2026 pukul 09:00–12:00 WIB. Mohon menampung air secukupnya. Terima kasih.",
  )
  const enough = remaining >= recipients
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", k)
    return () => window.removeEventListener("keydown", k)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Broadcast Pengumuman Massal"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#332924]/50 backdrop-blur-[3px]"
      />
      <div className="relative w-[520px] overflow-hidden rounded-2xl border border-[#E6E2D8] bg-white shadow-2xl">
        <header className="flex items-center gap-3 border-b border-[#E6E2D8] px-5 py-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#F59E0B]/12 text-amber-600">
            <Megaphone className="size-[18px]" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-[15px] font-bold text-[#2B221E]">
              Broadcast Pengumuman Massal
            </h3>
            <p className="text-[11.5px] text-slate-500">
              Dikirim ke {recipients} penghuni aktif · Kost Mulyorejo Asri
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="space-y-3 px-5 py-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-[#E6E2D8] px-3 py-2 text-[12.5px] leading-relaxed outline-none focus:border-[#8A6543] focus:ring-3 focus:ring-[#8A6543]/15"
          />
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11.5px] ${
              enough
                ? "bg-[#F6EFE6] text-[#8A6543]"
                : "bg-[#FFF1F2] text-rose-700"
            }`}
          >
            {enough ? (
              <Check className="size-3.5" />
            ) : (
              <AlertCircle className="size-3.5" />
            )}
            Memakai {recipients} kuota pesan · sisa setelah kirim{" "}
            {Math.max(0, remaining - recipients).toLocaleString("id-ID")}
          </div>
        </div>
        <footer className="flex justify-end gap-2 border-t border-[#E6E2D8] bg-[#FAF8F5] px-5 py-3">
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-[#E6E2D8] bg-white px-4 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={onSend}
            disabled={!enough || !text.trim()}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#F59E0B] px-4 text-[12.5px] font-semibold text-[#2B221E] hover:bg-[#D97706] hover:text-white disabled:opacity-50"
          >
            <Send className="size-3.5" /> Kirim ke {recipients} Penghuni
          </button>
        </footer>
      </div>
    </div>
  )
}
