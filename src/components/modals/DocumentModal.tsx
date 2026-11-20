import { Printer, FileText } from "lucide-react"
import type { ReactNode } from "react"
import { useStore, type Doc } from "@/store/store"
import {
  rupiah,
  fmtDate,
  TODAY,
  PERIOD,
  EXPENSE_CATEGORIES,
  monthsBetween,
} from "@/lib/data"
import { terbilang } from "@/lib/lib"
import { ModalShell, Btn } from "../ui"

function Letterhead({ title, no }: { title: string; no: string }) {
  const { property } = useStore()
  return (
    <>
      <div className="flex items-start justify-between border-b-2 border-[#5C432C] pb-3">
        <div>
          <p className="font-display text-[18px] font-extrabold tracking-[0.08em] text-[#2B211A]">
            SUPERKOST<span className="text-[#5C432C]">.</span>
          </p>
          <p className="text-[11px] text-slate-600">
            {property.name} · {property.area}
          </p>
          <p className="text-[11px] text-slate-500">
            Pengelola: Muhamad Maulana Rizki · 0812-9988-7766
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Nomor Dokumen
          </p>
          <p className="text-[12px] font-semibold text-slate-900">{no}</p>
          <p className="text-[11px] text-slate-500">{fmtDate(TODAY)}</p>
        </div>
      </div>
      <h2 className="mt-4 text-center font-display text-[15px] font-bold uppercase tracking-wide text-[#2B211A]">
        {title}
      </h2>
    </>
  )
}

const Row = ({ k, v, bold }: { k: string; v: ReactNode; bold?: boolean }) => (
  <div className="flex justify-between gap-4 border-b border-dashed border-slate-200 py-1.5 text-[12.5px]">
    <span className="text-slate-600">{k}</span>
    <span
      className={`text-right ${
        bold ? "font-bold text-slate-900" : "font-medium text-slate-800"
      }`}
    >
      {v}
    </span>
  </div>
)

function Signatures({ left, right }: { left: string; right: string }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-10 text-center text-[11.5px] text-slate-600">
      {[left, right].map((n, i) => (
        <div key={n}>
          <p>{i === 0 ? "Penghuni / Penyetor" : "Pengelola"}</p>
          <div className="mx-auto mt-12 w-40 border-t border-slate-400 pt-1 font-semibold text-slate-800">
            {n}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DocumentModal({
  doc,
  onClose,
}: {
  doc: Doc
  onClose: () => void
}) {
  const s = useStore()
  let title = ""
  let body: ReactNode = null

  if (doc.kind === "receipt") {
    const inv = s.db.invoices.find((i) => i.id === doc.invoiceId)
    const t = inv && s.db.tenants.find((x) => x.id === inv.tenantId)
    title = "Kuitansi Pembayaran Sewa"
    body = inv ? (
      <>
        <Letterhead title="Kuitansi Pembayaran Sewa" no={inv.id} />
        <div className="mt-4">
          <Row k="Telah terima dari" v={t?.name ?? "-"} />
          <Row
            k="Untuk pembayaran"
            v={`Sewa Kamar ${inv.roomNo} · Periode ${inv.period}`}
          />
          <Row
            k="Tanggal bayar"
            v={inv.paidOn ? fmtDate(inv.paidOn) : "Belum dibayar"}
          />
          <Row k="Metode" v={inv.method ?? "-"} />
          <Row
            k="Status"
            v={inv.status === "paid" ? "LUNAS" : "BELUM LUNAS"}
            bold
          />
        </div>
        <div className="mt-4 rounded-lg border border-[#E2D3C1] bg-[#F6EFE6] px-4 py-3">
          <p className="text-[11px] text-slate-600">Jumlah</p>
          <p className="font-display text-[22px] font-bold text-[#2B211A] tabular-nums">
            {rupiah(inv.amount)}
          </p>
          <p className="text-[11.5px] italic capitalize text-slate-600">
            Terbilang: {terbilang(inv.amount)} rupiah
          </p>
        </div>
        <Signatures left={t?.name ?? "-"} right="Muhamad Maulana Rizki" />
      </>
    ) : (
      <p>Kuitansi tidak ditemukan.</p>
    )
  } else if (doc.kind === "clearance") {
    const dep = s.db.deposits.find((d) => d.id === doc.depositId)
    const t = dep && s.db.tenants.find((x) => x.id === dep.tenantId)
    const ded = dep?.deductions ?? []
    const total = ded.reduce((a, x) => a + x.amount, 0)
    title = "Berita Acara Serah Terima Kamar"
    body = dep ? (
      <>
        <Letterhead
          title="Berita Acara Serah Terima Kamar & Pengembalian Deposit"
          no={`BA/2611/${dep.roomNo}`}
        />
        <p className="mt-4 text-[12.5px] leading-relaxed text-slate-700">
          Pada hari ini, {fmtDate(dep.refundDate ?? TODAY)}, telah dilakukan
          pemeriksaan kondisi fisik dan serah terima Kamar {dep.roomNo} dari
          penghuni <b>{dep.tenantName}</b> kepada pengelola, dengan masa sewa{" "}
          {t ? monthsBetween(t.start, t.endDate ?? TODAY) : "-"} bulan (sejak{" "}
          {fmtDate(dep.date)}).
        </p>
        <table className="mt-4 w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-slate-300 text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="py-1.5">Rincian</th>
              <th className="py-1.5 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-dashed border-slate-200">
              <td className="py-1.5">Deposit awal disetor</td>
              <td className="py-1.5 text-right tabular-nums">
                {rupiah(dep.amount)}
              </td>
            </tr>
            {ded.map((d) => (
              <tr
                key={d.name}
                className="border-b border-dashed border-slate-200 text-rose-700"
              >
                <td className="py-1.5">Potongan: {d.name}</td>
                <td className="py-1.5 text-right tabular-nums">
                  - {rupiah(d.amount)}
                </td>
              </tr>
            ))}
            {ded.length === 0 && (
              <tr className="border-b border-dashed border-slate-200 text-slate-500">
                <td className="py-1.5" colSpan={2}>
                  Tidak ada potongan kerusakan
                </td>
              </tr>
            )}
            <tr className="font-bold">
              <td className="py-2">Total dikembalikan ke penghuni</td>
              <td className="py-2 text-right text-emerald-700 tabular-nums">
                {rupiah(dep.refund ?? dep.amount - total)}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-[12px] text-slate-600">
          Ditransfer ke: {dep.refundBank ?? "-"}
        </p>
        <Signatures left={dep.tenantName} right="Muhamad Maulana Rizki" />
      </>
    ) : (
      <p>Data deposit tidak ditemukan.</p>
    )
  } else {
    const { stats, expenses } = s
    title = "Laporan Laba Rugi"
    const byCat = EXPENSE_CATEGORIES.map(
      (c) =>
        [
          c,
          expenses
            .filter((e) => e.category === c)
            .reduce((a, e) => a + e.amount, 0),
        ] as const,
    ).filter(([, v]) => v > 0)
    body = (
      <>
        <Letterhead
          title={`Laporan Laba Rugi Operasional · ${PERIOD}`}
          no={`LR/2611/${s.propId.slice(0, 3).toUpperCase()}`}
        />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Pendapatan
        </p>
        <Row
          k={`Pendapatan sewa (${stats.paidCount} transaksi terverifikasi)`}
          v={rupiah(stats.income)}
        />
        <Row
          k="Pendapatan lain (potongan deposit kerusakan)"
          v={rupiah(stats.otherIncome)}
        />
        <Row
          k="Total pendapatan"
          v={rupiah(stats.income + stats.otherIncome)}
          bold
        />
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Beban Operasional
        </p>
        {byCat.map(([c, v]) => (
          <Row key={c} k={c} v={`- ${rupiah(v)}`} />
        ))}
        <Row k="Total beban" v={`- ${rupiah(stats.expenseTotal)}`} bold />
        <div className="mt-4 flex items-center justify-between rounded-lg border border-[#10B981]/30 bg-[#10B981]/[0.06] px-4 py-3">
          <span className="text-[13px] font-semibold text-slate-800">
            Laba Bersih Operasional
          </span>
          <span
            className={`font-display text-[20px] font-bold tabular-nums ${
              stats.net >= 0 ? "text-emerald-700" : "text-rose-600"
            }`}
          >
            {rupiah(stats.net)}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">
          Margin laba{" "}
          {stats.income
            ? ((stats.net / (stats.income + stats.otherIncome)) * 100).toFixed(
                1,
              )
            : 0}
          % · Dana deposit penghuni ({rupiah(stats.depositHeld)}) dicatat
          terpisah sebagai kewajiban, bukan pendapatan.
        </p>
      </>
    )
  }

  return (
    <ModalShell
      title={title}
      subtitle="Pratinjau dokumen resmi · gunakan Cetak untuk menyimpan sebagai PDF"
      icon={<FileText className="size-[18px]" />}
      onClose={onClose}
      width={680}
      z="z-[55]"
      footer={
        <>
          <p className="mr-auto text-[11px] text-slate-500">
            Di jendela cetak, pilih tujuan &ldquo;Simpan sebagai PDF&rdquo;.
          </p>
          <Btn variant="secondary" onClick={onClose}>
            Tutup
          </Btn>
          <Btn variant="dark" onClick={() => window.print()}>
            <Printer className="size-4" /> Cetak / Simpan PDF
          </Btn>
        </>
      }
    >
      <div className="bg-slate-100 p-5">
        <div className="print-area mx-auto bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {body}
        </div>
      </div>
    </ModalShell>
  )
}
