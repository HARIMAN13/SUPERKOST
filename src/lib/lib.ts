/** Download rows as a UTF-8 CSV (BOM so Excel renders Indonesian characters correctly). */
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n")
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const waLink = (phone: string, text = "") => {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "62")
  return `https://wa.me/${digits}${
    text ? `?text=${encodeURIComponent(text)}` : ""
  }`
}

const SATUAN = [
  "",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
  "sepuluh",
  "sebelas",
]
/** Indonesian number-to-words, used on official receipts. */
export function terbilang(n: number): string {
  n = Math.floor(n)
  if (n < 12) return SATUAN[n]
  if (n < 20) return `${terbilang(n - 10)} belas`
  if (n < 100)
    return `${terbilang(Math.floor(n / 10))} puluh ${terbilang(n % 10)}`.trim()
  if (n < 200) return `seratus ${terbilang(n - 100)}`.trim()
  if (n < 1000)
    return `${terbilang(Math.floor(n / 100))} ratus ${terbilang(n % 100)}`.trim()
  if (n < 2000) return `seribu ${terbilang(n - 1000)}`.trim()
  if (n < 1e6)
    return `${terbilang(Math.floor(n / 1000))} ribu ${terbilang(n % 1000)}`.trim()
  if (n < 1e9)
    return `${terbilang(Math.floor(n / 1e6))} juta ${terbilang(n % 1e6)}`.trim()
  return `${terbilang(Math.floor(n / 1e9))} miliar ${terbilang(n % 1e9)}`.trim()
}
