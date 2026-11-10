import { useCallback, useRef, useState } from "react"

export type RuleId = "h3" | "h0" | "late" | "receipt"
export interface Rule {
  id: RuleId
  name: string
  time: string | null
  on: boolean
  template: string
  tag: string
}
export interface OutMsg {
  id: number
  time: string
  room: number | null
  name: string
  tpl: string
  status: "read" | "delivered" | "sending"
}

export const QUOTA = 2000

const INITIAL_RULES: Rule[] = [
  {
    id: "h3",
    name: "Pengingat H-3 Jatuh Tempo",
    time: "08:00",
    on: true,
    tag: "Template H-3",
    template:
      "Halo Kak {nama_penghuni}, tagihan sewa kamar {nomor_kamar} sebesar Rp{nominal_tagihan} jatuh tempo pada {tanggal_jatuh_tempo}. Mohon transfer ke {rekening_bank}. Abaikan pesan ini jika sudah membayar. Terima kasih.",
  },
  {
    id: "h0",
    name: "Pengingat Hari H Jatuh Tempo",
    time: "09:00",
    on: true,
    tag: "Template Hari H",
    template:
      "Halo Kak {nama_penghuni}, hari ini ({tanggal_jatuh_tempo}) adalah jatuh tempo sewa kamar {nomor_kamar} sebesar Rp{nominal_tagihan}. Silakan transfer ke {rekening_bank} lalu unggah bukti lewat link berikut.",
  },
  {
    id: "late",
    name: "Peringatan Tunggakan H+1",
    time: "10:00",
    on: true,
    tag: "Template Tunggakan",
    template:
      "Halo Kak {nama_penghuni}, tagihan sewa kamar {nomor_kamar} sebesar Rp{nominal_tagihan} telah melewati jatuh tempo {tanggal_jatuh_tempo}. Mohon segera lakukan pembayaran ke {rekening_bank} agar tidak dikenakan denda.",
  },
  {
    id: "receipt",
    name: "Kuitansi Pembayaran Lunas",
    time: null,
    on: true,
    tag: "Kuitansi Lunas Digital",
    template:
      "Terima kasih Kak {nama_penghuni}! Pembayaran sewa kamar {nomor_kamar} sebesar Rp{nominal_tagihan} telah kami terima. Kuitansi digital terlampir. Periode berikutnya jatuh tempo {tanggal_jatuh_tempo}.",
  },
]

const seed: [string, number, string, string, OutMsg["status"]][] = [
  ["08:00", 102, "Aditya A.", "Template H-3", "read"],
  ["08:00", 105, "Farril N.", "Template H-3", "read"],
  ["08:00", 107, "Intan P.", "Template H-3", "read"],
  ["08:00", 203, "Citra A.", "Template H-3", "delivered"],
  ["08:00", 302, "Laras W.", "Template H-3", "read"],
  ["08:00", 306, "Ilham A.", "Template H-3", "delivered"],
  ["09:00", 202, "Fajar N.", "Template Hari H", "read"],
  ["09:00", 309, "Nabila Z.", "Template Hari H", "delivered"],
  ["10:00", 204, "Dimas W.", "Template Tunggakan", "delivered"],
  ["10:00", 308, "Reza M.", "Template Tunggakan", "read"],
  ["10:45", 105, "Farril N.", "Kuitansi Lunas Digital", "delivered"],
]

export const shortName = (n = "") => {
  const w = n.replace("Muhammad ", "").split(" ")
  return w.length > 1 ? `${w[0]} ${w[1][0]}.` : w[0]
}

/** Shared WhatsApp gateway state so other screens (e.g. payment approval) can push to the outbox. */
export function useWhatsApp() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES)
  const [outbox, setOutbox] = useState<OutMsg[]>(() =>
    seed.map(([time, room, name, tpl, status], id) => ({
      id,
      time,
      room,
      name,
      tpl,
      status,
    })),
  )
  const [used, setUsed] = useState(1840)
  const nextId = useRef(1000)

  const push = useCallback((msgs: Omit<OutMsg, "id" | "status">[]) => {
    const ids = msgs.map(() => nextId.current++)
    setOutbox((o) => [
      ...o,
      ...msgs.map((m, i) => ({ ...m, id: ids[i], status: "sending" as const })),
    ])
    setUsed((u) => u + msgs.length)
    window.setTimeout(
      () =>
        setOutbox((o) =>
          o.map((m) =>
            ids.includes(m.id) ? { ...m, status: "delivered" } : m,
          ),
        ),
      1600,
    )
  }, [])

  return { rules, setRules, outbox, used, push }
}

export type WhatsAppState = ReturnType<typeof useWhatsApp>
