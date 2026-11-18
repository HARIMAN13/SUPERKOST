// ---------- Shared primitives ----------
export const TODAY = "2026-11-05"
export const PERIOD = "November 2026"
const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
]

export const rupiah = (n: number) =>
  "Rp" + Math.round(n).toLocaleString("id-ID")
export const pad = (n: number) => String(n).padStart(2, "0")
export const iso = (y: number, m: number, d: number) =>
  `${y}-${pad(m)}-${pad(d)}`
const parts = (s: string) =>
  s.split("-").map(Number) as [number, number, number]
export const fmtDate = (s: string) => {
  const [y, m, d] = parts(s)
  return `${pad(d)} ${MON[m - 1]} ${y}`
}
export const fmtShort = (s: string) => {
  const [, m, d] = parts(s)
  return `${pad(d)} ${MON[m - 1]}`
}
export const toDate = (s: string) => {
  const [y, m, d] = parts(s)
  return new Date(y, m - 1, d)
}
export const addDays = (s: string, n: number) => {
  const d = toDate(s)
  d.setDate(d.getDate() + n)
  return iso(d.getFullYear(), d.getMonth() + 1, d.getDate())
}
export const monthsBetween = (from: string, to = TODAY) => {
  const [y1, m1, d1] = parts(from)
  const [y2, m2, d2] = parts(to)
  return Math.max(0, (y2 - y1) * 12 + (m2 - m1) - (d2 < d1 ? 1 : 0))
}
export const nowTime = () =>
  new Date()
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    })
    .replace(".", ":")
export const initials = (name = "") =>
  name
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

// ---------- Normalized records ----------
export type PropId = "mulyorejo" | "dharmawangsa" | "sukolilo"
export type RoomType = "Deluxe" | "Standard" | "Superior"

export interface Property {
  id: PropId
  name: string
  area: string
}
export interface RoomRec {
  no: number
  floor: number
  type: RoomType
  price: number
  vip?: boolean
}
export interface Tenant {
  id: string
  propId: PropId
  roomNo: number | null
  name: string
  phone: string
  emergency: { name: string; rel: string; phone: string }
  start: string
  dueDay: number
  bank: string
  ktp?: string
  active: boolean
  endDate?: string
}
export type InvoiceStatus = "paid" | "verify" | "overdue" | "void"
export interface Invoice {
  id: string
  propId: PropId
  roomNo: number
  tenantId: string
  period: string
  amount: number
  status: InvoiceStatus
  paidOn?: string
  method?: string
  overdueDays?: number
  proof?: { uploaded: string; txTime: string; ref: string }
}
export type DepositStatus = "locked" | "dispute" | "refunded"
export interface Deposit {
  id: string
  propId: PropId
  roomNo: number
  tenantId: string
  tenantName: string
  amount: number
  date: string
  status: DepositStatus
  deductions?: { name: string; amount: number }[]
  refund?: number
  refundBank?: string
  refundDate?: string
}
export type ExpenseCategory = "Listrik" | "Air" | "Kebersihan" | "Gaji" | "Servis AC" | "Internet" | "Perbaikan" | "Lainnya"
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Listrik",
  "Air",
  "Kebersihan",
  "Gaji",
  "Servis AC",
  "Internet",
  "Perbaikan",
  "Lainnya",
]
export interface Expense {
  id: string
  propId: PropId
  date: string
  category: ExpenseCategory
  desc: string
  amount: number
  source: "Manual" | "Tiket Servis" | "Sistem"
}
export interface AcUnit {
  room: number
  brand: string
  pk: string
  last: string
}
export type TicketCategory = "AC" | "Pompa Air & Ledeng" | "Listrik" | "Bangunan & Lainnya"
export interface Ticket {
  id: string
  propId: PropId
  room: number | null
  category: TicketCategory
  job: string
  vendor: string
  date: string
  cost: number
  note: string
  status: "open" | "done"
  createdAt: string
}

/** Denormalized room view consumed by the UI (grid cards, ledger rows, drawer). */
export type RoomStatus = "paid" | "overdue" | "verify" | "vacant"
export interface Room extends RoomRec {
  status: RoomStatus
  tenant?: string
  tenantId?: string
  paidUntil?: string
  paidOn?: string
  overdueDays?: number
  invoiceId?: string
}

export const PROPERTIES: Property[] = [
  { id: "mulyorejo", name: "Kost Mulyorejo Asri", area: "Surabaya Timur" },
  { id: "dharmawangsa", name: "Kost Dharmawangsa", area: "Surabaya Pusat" },
  { id: "sukolilo", name: "Mega Kost Sukolilo", area: "Surabaya Timur" },
]

export interface DB {
  rooms: Record<PropId, RoomRec[]>
  tenants: Tenant[]
  invoices: Invoice[]
  deposits: Deposit[]
  expenses: Expense[]
  units: Record<PropId, AcUnit[]>
  tickets: Ticket[]
}

// ---------- Seed generation ----------
const MULYOREJO_NAMES: Record<number, string> = {
  101: "Rafi Hariman",
  102: "Aditya Alif S.",
  103: "Bagas Pratama",
  104: "Salsabila A.",
  105: "Muhammad Farril N.",
  106: "Yoga Saputra",
  107: "Intan Permata",
  108: "Rizky Fadilah",
  109: "Aulia Rahma",
  201: "Dewi Lestari",
  202: "Fajar Nugroho",
  203: "Citra Anindya",
  204: "Dimas Wahyu",
  205: "Arif Hidayat",
  206: "Maya Sari",
  207: "Hendra Kusuma",
  208: "Putri Ayu",
  209: "Galih Ramadhan",
  210: "Tasya Kamila",
  301: "Bima Sakti",
  302: "Laras Wening",
  303: "Andika Prasetyo",
  304: "Rina Marlina",
  306: "Ilham Akbar",
  307: "Sekar Arum",
  308: "Reza Mahendra",
  309: "Nabila Zahra",
  310: "Gilang Permana",
}
const FIRST = [
  "Adi",
  "Bayu",
  "Cahya",
  "Dian",
  "Eka",
  "Fikri",
  "Gita",
  "Hana",
  "Indra",
  "Joko",
  "Kiki",
  "Lina",
  "Mira",
  "Nanda",
  "Oki",
  "Pandu",
  "Rani",
  "Sinta",
  "Tegar",
  "Umar",
  "Vina",
  "Wulan",
  "Yusuf",
  "Zahra",
  "Bintang",
  "Dinda",
  "Farhan",
  "Kevin",
  "Nisa",
  "Raka",
]
const LAST = [
  "Pratama",
  "Saputra",
  "Lestari",
  "Wijaya",
  "Nugroho",
  "Rahayu",
  "Hidayat",
  "Kurniawan",
  "Permata",
  "Santoso",
  "Utami",
  "Firmansyah",
  "Maharani",
  "Setiawan",
  "Anggraini",
]
const BRANDS = ["Sharp", "Panasonic", "LG", "Daikin", "Gree", "Samsung"]
const BANKS = ["BCA", "BRI", "Mandiri", "BNI"]

interface Cfg {
  id: PropId
  floors: number
  perFloor: number
  price: (floor: number, no: number) => number
  type: (floor: number) => RoomType
  deposit: number
  name: (no: number, idx: number) => string
  vacant: (no: number, idx: number) => boolean
  overdue: (no: number, idx: number) => number | 0
  verify: (no: number, idx: number) => boolean
  vip?: number[]
}

function seedProperty(c: Cfg, db: DB) {
  const rooms: RoomRec[] = []
  const units: AcUnit[] = []
  let idx = 0
  for (let f = 1; f <= c.floors; f++) {
    for (let i = 1; i <= c.perFloor; i++, idx++) {
      const no = f * 100 + i
      const type = c.type(f)
      rooms.push({
        no,
        floor: f,
        type,
        price: c.price(f, no),
        vip: c.vip?.includes(no),
      })
      units.push({
        room: no,
        brand: BRANDS[no % BRANDS.length],
        pk: type === "Deluxe" ? "3/4 PK" : "1/2 PK",
        last:
          c.id === "mulyorejo"
            ? addDays("2026-07-10", (no * 17) % 110)
            : addDays(TODAY, -((no * 37 + idx) % 150) - 8),
      })
      const od = c.overdue(no, idx)
      const vacant = !od && !c.verify(no, idx) && c.vacant(no, idx)
      if (vacant) continue

      const tId = `${c.id}-t${no}`
      const start = iso(
        2026,
        (no % 9) + 1 > 10 ? 10 : (no % 9) + 1,
        (no % 27) + 1,
      )
      db.tenants.push({
        id: tId,
        propId: c.id,
        roomNo: no,
        name: c.name(no, idx),
        phone: `+62 81${no % 9}-${1000 + ((no * 37 + idx) % 9000)}-${1000 + ((no * 53 + idx) % 9000)}`,
        emergency:
          no % 2
            ? {
                name: "Bapak Hartono",
                rel: "Ayah Kandung",
                phone: `0813-${((no * 41) % 9000) + 1000}-${((no * 29) % 9000) + 1000}`,
              }
            : {
                name: "Ibu Wulan",
                rel: "Ibu Kandung",
                phone: `0813-${((no * 43) % 9000) + 1000}-${((no * 31) % 9000) + 1000}`,
              },
        start,
        dueDay: Math.min(28, (no % 27) + 1),
        bank: BANKS[no % BANKS.length],
        active: true,
      })
      const status: InvoiceStatus = od
        ? "overdue"
        : c.verify(no, idx)
          ? "verify"
          : "paid"
      db.invoices.push({
        id: `INV/2611/${
          c.id === "mulyorejo" ? "" : c.id.slice(0, 3).toUpperCase() + "-"
        }${no}`,
        propId: c.id,
        roomNo: no,
        tenantId: tId,
        period: PERIOD,
        amount: c.price(f, no),
        status,
        overdueDays: od || undefined,
        paidOn:
          status === "paid" ? iso(2026, 11, 1 + ((no * 3) % 5)) : undefined,
        method:
          status === "paid"
            ? no % 4 === 0
              ? "Tunai"
              : `Transfer ${BANKS[no % BANKS.length]}`
            : undefined,
        proof:
          status === "verify"
            ? {
                uploaded: "Hari ini, 08:30 WIB",
                txTime: "08:27",
                ref: `26110${no}0001`,
              }
            : undefined,
      })
      db.deposits.push({
        id: `dep-${tId}`,
        propId: c.id,
        roomNo: no,
        tenantId: tId,
        tenantName: c.name(no, idx),
        amount: c.deposit,
        date: start,
        status: "locked",
      })
    }
  }
  db.rooms[c.id] = rooms
  db.units[c.id] = units
}

const genName = (seed: number) => (no: number, idx: number) =>
  `${FIRST[(idx * 7 + seed) % FIRST.length]} ${LAST[(idx * 5 + seed + Math.floor(no / 100)) % LAST.length]}`

export function emptyDb(): DB {
  return {
    rooms: {} as DB["rooms"],
    tenants: [],
    invoices: [],
    deposits: [],
    expenses: [],
    units: {} as DB["units"],
    tickets: [],
  }
}

export function createSeed(): DB {
  const db: DB = {
    rooms: {} as DB["rooms"],
    tenants: [],
    invoices: [],
    deposits: [],
    expenses: [],
    units: {} as DB["units"],
    tickets: [],
  }

  seedProperty(
    {
      id: "mulyorejo",
      floors: 3,
      perFloor: 10,
      price: (_f, no) => (no === 102 ? 1_750_000 : 1_500_000),
      type: (f) => (f === 1 ? "Deluxe" : f === 2 ? "Standard" : "Superior"),
      deposit: 1_000_000,
      name: (no) => MULYOREJO_NAMES[no],
      vacant: (no) => no === 110 || no === 305,
      overdue: (no) => (no === 204 ? 3 : no === 308 ? 6 : 0),
      verify: (no) => no === 105 || no === 209,
      vip: [101, 301],
    },
    db,
  )
  seedProperty(
    {
      id: "dharmawangsa",
      floors: 3,
      perFloor: 5,
      price: () => 1_200_000,
      type: (f) => (f === 1 ? "Deluxe" : "Standard"),
      deposit: 800_000,
      name: genName(3),
      vacant: (no) => no === 203,
      overdue: (no) => (no === 105 ? 2 : 0),
      verify: (no) => no === 302,
    },
    db,
  )
  seedProperty(
    {
      id: "sukolilo",
      floors: 4,
      perFloor: 40,
      price: (f) => (f === 1 ? 1_100_000 : 950_000),
      type: (f) => (f === 1 ? "Deluxe" : f === 4 ? "Superior" : "Standard"),
      deposit: 750_000,
      name: genName(11),
      vacant: (_no, idx) => idx % 13 === 5,
      overdue: (_no, idx) => (idx % 8 === 3 ? 1 + (idx % 9) : 0),
      verify: (_no, idx) => idx % 20 === 7,
    },
    db,
  )

  // Mulyorejo hand-tuned details from earlier screens.
  const t = (no: number) => db.tenants.find((x) => x.id === `mulyorejo-t${no}`)!
  Object.assign(t(204), {
    phone: "+62 812-3456-7890",
    start: "2026-01-15",
    dueDay: 10,
    bank: "Mandiri",
    emergency: {
      name: "Ibu Siti",
      rel: "Ibu Kandung",
      phone: "0811-2233-4455",
    },
  })
  Object.assign(t(101), { dueDay: 28 })
  Object.assign(t(102), { dueDay: 6 })
  Object.assign(t(202), { dueDay: 6 })
  Object.assign(t(302), { dueDay: 8 })
  db.deposits.find((d) => d.id === "dep-mulyorejo-t204")!.date = "2026-01-15"
  const inv = (no: number) =>
    db.invoices.find((i) => i.propId === "mulyorejo" && i.roomNo === no)!
  Object.assign(inv(101), { paidOn: "2026-11-10", method: "Transfer BCA" })
  Object.assign(inv(102), { paidOn: "2026-11-08", method: "Transfer BCA" })
  inv(105).proof = {
    uploaded: "Hari ini, 10:45 WIB",
    txTime: "10:42",
    ref: "2611050421987",
  }
  inv(209).proof = {
    uploaded: "Hari ini, 09:12 WIB",
    txTime: "09:08",
    ref: "2611050316544",
  }
  db.deposits.find((d) => d.id === "dep-mulyorejo-t308")!.status = "dispute"
  db.units.mulyorejo.find((u) => u.room === 204)!.last = "2026-05-10"
  db.units.mulyorejo.find((u) => u.room === 105)!.last = "2026-06-15"
  db.units.mulyorejo.find((u) => u.room === 101)!.last = "2026-09-15"
  Object.assign(db.units.mulyorejo.find((u) => u.room === 204)!, {
    brand: "Daikin",
    pk: "1/2 PK",
  })
  Object.assign(db.units.mulyorejo.find((u) => u.room === 105)!, {
    brand: "Panasonic",
    pk: "1/2 PK",
  })
  Object.assign(db.units.mulyorejo.find((u) => u.room === 101)!, {
    brand: "Sharp",
    pk: "1/2 PK",
  })

  // Past tenants whose deposits were already settled (rooms 110 & 305 are now vacant).
  for (const [no, name, ded, date] of [
    [110, "Kevin Wijaya", 0, "2026-10-28"],
    [305, "Yudha Pratama", 150_000, "2026-10-12"],
  ] as const) {
    const id = `mulyorejo-old${no}`
    db.tenants.push({
      id,
      propId: "mulyorejo",
      roomNo: null,
      name,
      phone: "+62 815-0000-" + no,
      emergency: { name: "-", rel: "-", phone: "-" },
      start: "2025-11-01",
      dueDay: 1,
      bank: "BCA",
      active: false,
      endDate: date,
    })
    db.deposits.push({
      id: `dep-${id}`,
      propId: "mulyorejo",
      roomNo: no,
      tenantId: id,
      tenantName: name,
      amount: 1_000_000,
      date: "2025-11-01",
      status: "refunded",
      deductions: ded ? [{ name: "Cat ulang dinding", amount: ded }] : [],
      refund: 1_000_000 - ded,
      refundBank: "BCA",
      refundDate: date,
    })
  }

  const exp = (
    propId: PropId,
    rows: [string, ExpenseCategory, string, number][],
  ) =>
    rows.forEach(([date, category, desc, amount], i) =>
      db.expenses.push({
        id: `${propId}-e${i}`,
        propId,
        date,
        category,
        desc,
        amount,
        source: category === "Servis AC" ? "Tiket Servis" : "Manual",
      }),
    )
  exp("mulyorejo", [
    ["2026-11-01", "Gaji", "Gaji Staf Penjaga (Pak Darto)", 2_500_000],
    ["2026-11-02", "Air", "Tagihan Air PAM Oktober", 650_000],
    ["2026-11-02", "Internet", "Wi-Fi IndiHome 100 Mbps", 300_000],
    ["2026-11-03", "Servis AC", "Cuci AC Kamar 203", 150_000],
    ["2026-11-03", "Servis AC", "Cuci AC Kamar 306", 150_000],
    ["2026-11-04", "Servis AC", "Cuci AC Kamar 107", 150_000],
    ["2026-11-05", "Kebersihan", "Iuran Sampah RT", 100_000],
    ["2026-11-05", "Listrik", "Token Listrik Pompa Air", 250_000],
  ])
  exp("dharmawangsa", [
    ["2026-11-01", "Gaji", "Gaji Staf Penjaga", 1_500_000],
    ["2026-11-02", "Air", "Tagihan Air PAM Oktober", 400_000],
    ["2026-11-02", "Internet", "Wi-Fi 50 Mbps", 250_000],
    ["2026-11-04", "Servis AC", "Cuci AC Kamar 102", 150_000],
    ["2026-11-05", "Listrik", "Token Listrik Pompa Air", 200_000],
  ])
  exp("sukolilo", [
    ["2026-11-01", "Gaji", "Gaji 3 Staf Penjaga & Kebersihan", 7_500_000],
    ["2026-11-02", "Air", "Tagihan Air PAM Oktober", 3_400_000],
    ["2026-11-02", "Internet", "Dedicated Internet 300 Mbps", 1_500_000],
    ["2026-11-03", "Servis AC", "Cuci AC 6 Unit Lantai 1", 900_000],
    ["2026-11-04", "Kebersihan", "Iuran Sampah & Kebersihan", 400_000],
    ["2026-11-05", "Listrik", "Token Listrik Pompa & Lift", 1_200_000],
  ])
  return db
}

// ---------- AC cycle helpers ----------
export const AC_CYCLE = 5
export function since(from: string) {
  const a = toDate(from)
  const b = toDate(TODAY)
  let m = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth()
  let d = b.getDate() - a.getDate()
  if (d < 0) {
    m -= 1
    d += new Date(b.getFullYear(), b.getMonth(), 0).getDate()
  }
  return { m, d, total: m + d / 30 }
}
export type AcHealth = "overdue" | "upcoming" | "healthy"
export const acHealth = (last: string): AcHealth => {
  const { total } = since(last)
  return total >= AC_CYCLE ? "overdue" : total >= 4 ? "upcoming" : "healthy"
}
