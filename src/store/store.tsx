import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  createSeed,
  PROPERTIES,
  PERIOD,
  TODAY,
  nowTime,
  acHealth,
  type DB,
  type PropId,
  type Room,
  type Tenant,
  type Expense,
  type Ticket,
  type TicketCategory,
  type Invoice,
} from "@/lib/data"
import { useWhatsApp, shortName } from "@/lib/wa"

export type Page = "dashboard" | "rooms" | "tenants" | "billing" | "deposits" | "finance" | "maintenance" | "staff" | "whatsapp"
export type FinanceTab = "kas" | "laba"
export type Doc = { kind: "receipt"; invoiceId: string } | {
  kind: "clearance"
  depositId: string
} | { kind: "report" }
export type Modal = { type: "checkIn"; roomNo?: number; tenantId?: string } | {
  type: "payment"
  roomNo?: number
  method?: string
} | { type: "ticket"; roomNo?: number | null; category?: TicketCategory } | {
  type: "doc"
  doc: Doc
} | { type: "roomAction"; kind: "tarif" | "move"; roomNo: number } | null

export interface CheckInInput {
  roomNo: number
  name: string
  phone: string
  emergency: { name: string; rel: string; phone: string }
  start: string
  deposit: number
  ktp?: string
  method: string
}

const TASKS = [
  {
    id: "toren",
    label: "Cek level & kebersihan toren air",
    area: "Atap · 07:00",
  },
  {
    id: "sapu",
    label: "Sapu & pel lorong Lantai 1–3",
    area: "Semua lantai · 08:00",
  },
  {
    id: "sampah",
    label: "Buang sampah ke TPS utama",
    area: "Depan gerbang · 09:00",
  },
  {
    id: "lampu",
    label: "Cek lampu lorong & CCTV parkir",
    area: "Area parkir · 17:00",
  },
  {
    id: "gerbang",
    label: "Cek & kunci gerbang malam",
    area: "Gerbang utama · 22:00",
  },
]

function buildRooms(db: DB, propId: PropId): Room[] {
  const tenants = new Map(
    db.tenants
      .filter((t) => t.active && t.propId === propId)
      .map((t) => [t.roomNo, t]),
  )
  const invoices = new Map(
    db.invoices
      .filter(
        (i) =>
          i.propId === propId && i.period === PERIOD && i.status !== "void",
      )
      .map((i) => [`${i.roomNo}:${i.tenantId}`, i]),
  )
  return db.rooms[propId].map((r) => {
    const t = tenants.get(r.no)
    if (!t) return { ...r, status: "vacant" as const }
    const inv = invoices.get(`${r.no}:${t.id}`)
    const paidOn = inv?.paidOn
      ? inv.paidOn.slice(8, 10) +
        " " +
        [
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
        ][Number(inv.paidOn.slice(5, 7)) - 1]
      : undefined
    return {
      ...r,
      status:
        inv?.status === "void" || !inv
          ? "paid" as const
          : inv.status as Room["status"],
      tenant: t.name,
      tenantId: t.id,
      invoiceId: inv?.id,
      paidOn,
      paidUntil: `${String(t.dueDay).padStart(2, "0")} Des`,
      overdueDays: inv?.overdueDays,
    }
  })
}

function useStoreValue() {
  const [db, setDb] = useState<DB>(createSeed)
  const [propId, setPropId] = useState<PropId>("mulyorejo")
  const [page, setPage] = useState<Page>("dashboard")
  const [financeTab, setFinanceTab] = useState<FinanceTab>("kas")
  const [drawerNo, setDrawerNo] = useState<number | null>(null)
  const [checkoutNo, setCheckoutNo] = useState<number | null>(null)
  const [modal, setModal] = useState<Modal>(null)
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null)
  const [tasks, setTasks] = useState(() =>
    TASKS.map((t) => ({
      ...t,
      done: t.id === "toren",
      at: t.id === "toren" ? "07:05" : "",
    })),
  )
  const [nextGenerated, setNextGenerated] = useState<Record<string, boolean>>(
    {},
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState<"owner" | "staff">("owner")
  const toastTimer = useRef<number | undefined>(undefined)
  const wa = useWhatsApp()

  const property = PROPERTIES.find((p) => p.id === propId)!
  const rooms = useMemo(() => buildRooms(db, propId), [db, propId])
  const tenants = useMemo(
    () => db.tenants.filter((t) => t.propId === propId),
    [db, propId],
  )
  const invoices = useMemo(
    () => db.invoices.filter((i) => i.propId === propId && i.period === PERIOD),
    [db, propId],
  )
  const deposits = useMemo(
    () => db.deposits.filter((d) => d.propId === propId),
    [db, propId],
  )
  const expenses = useMemo(
    () =>
      db.expenses
        .filter((e) => e.propId === propId)
        .sort(
          (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id),
        ),
    [db, propId],
  )
  const units = db.units[propId]
  const tickets = useMemo(
    () => db.tickets.filter((t) => t.propId === propId),
    [db, propId],
  )

  const stats = useMemo(() => {
    const paid = invoices.filter((i) => i.status === "paid")
    const income = paid.reduce((s, i) => s + i.amount, 0)
    const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0)
    const otherIncome = deposits
      .filter(
        (d) => d.status === "refunded" && d.refundDate?.startsWith("2026-11"),
      )
      .reduce(
        (s, d) => s + (d.deductions ?? []).reduce((a, x) => a + x.amount, 0),
        0,
      )
    const held = deposits.filter((d) => d.status !== "refunded")
    return {
      income,
      paidCount: paid.length,
      otherIncome,
      expenseTotal,
      net: income + otherIncome - expenseTotal,
      depositHeld: held.reduce((s, d) => s + d.amount, 0),
      depositCount: held.length,
      occupied: rooms.filter((r) => r.status !== "vacant").length,
      vacant: rooms.filter((r) => r.status === "vacant").length,
      overdue: rooms.filter((r) => r.status === "overdue"),
      verify: rooms.filter((r) => r.status === "verify"),
      acOverdue: units.filter((u) => acHealth(u.last) === "overdue"),
      totalBilled: invoices
        .filter((i) => i.status !== "void")
        .reduce((s, i) => s + i.amount, 0),
    }
  }, [invoices, expenses, deposits, rooms, units])

  const notify = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), msg })
    toastTimer.current = window.setTimeout(() => setToast(null), 3000)
  }, [])

  const navigate = useCallback((p: Page, tab?: FinanceTab) => {
    setPage(p)
    if (tab) setFinanceTab(tab)
    setDrawerNo(null)
    window.scrollTo({ top: 0 })
  }, [])
  const switchProperty = (id: PropId) => {
    setPropId(id)
    setDrawerNo(null)
    setCheckoutNo(null)
    setModal(null)
    notify(`Beralih ke ${PROPERTIES.find((p) => p.id === id)!.name}`)
  }

  const openDrawer = useCallback((no: number | null) => setDrawerNo(no), [])
  const openCheckout = useCallback((no: number | null) => setCheckoutNo(no), [])
  const openModal = useCallback((m: Modal) => setModal(m), [])

  // ---------- helpers ----------
  const tenantName = (id: string) =>
    db.tenants.find((t) => t.id === id)?.name ?? ""
  const findInvoice = (roomNo: number) => {
    const t = db.tenants.find(
      (x) => x.active && x.propId === propId && x.roomNo === roomNo,
    )
    return t
      ? db.invoices.find(
          (i) =>
            i.propId === propId &&
            i.roomNo === roomNo &&
            i.tenantId === t.id &&
            i.period === PERIOD &&
            i.status !== "void",
        )
      : undefined
  }
  const patchInvoice = (id: string, p: Partial<Invoice>) =>
    setDb((d) => ({
      ...d,
      invoices: d.invoices.map((i) => (i.id === id ? { ...i, ...p } : i)),
    }))
  const receiptRuleOn = () =>
    wa.rules.find((r) => r.id === "receipt")?.on ?? false
  const pushWa = (roomNo: number | null, name: string, tpl: string) =>
    wa.push([{ time: nowTime(), room: roomNo, name, tpl }])

  // ---------- payments ----------
  const approvePayment = (roomNo: number) => {
    const inv = findInvoice(roomNo)
    if (!inv) return
    patchInvoice(inv.id, {
      status: "paid",
      paidOn: TODAY,
      method: "Transfer BCA",
      overdueDays: undefined,
    })
    const on = receiptRuleOn()
    if (on)
      pushWa(
        roomNo,
        shortName(tenantName(inv.tenantId)),
        "Kuitansi Lunas Digital",
      )
    notify(
      `Pembayaran Kmr ${roomNo} disetujui · ${
        on
          ? "kuitansi lunas dikirim otomatis via WA"
          : "otomasi kuitansi WA nonaktif"
      }`,
    )
  }
  const rejectPayment = (roomNo: number) => {
    const inv = findInvoice(roomNo)
    if (!inv) return
    patchInvoice(inv.id, {
      status: "overdue",
      overdueDays: 1,
      proof: undefined,
    })
    pushWa(
      roomNo,
      shortName(tenantName(inv.tenantId)),
      "Minta Kirim Ulang Bukti",
    )
    notify(
      `Bukti transfer Kmr ${roomNo} ditolak · permintaan kirim ulang dikirim via WA`,
    )
  }
  const recordPayment = (p: {
    roomNo: number
    amount: number
    method: string
    date: string
    sendWa: boolean
  }) => {
    const inv = findInvoice(p.roomNo)
    if (!inv) return null
    patchInvoice(inv.id, {
      status: "paid",
      paidOn: p.date,
      method: p.method,
      amount: p.amount,
      overdueDays: undefined,
    })
    if (p.sendWa)
      pushWa(
        p.roomNo,
        shortName(tenantName(inv.tenantId)),
        "Kuitansi Lunas Digital",
      )
    notify(`Pembayaran Kmr ${p.roomNo} dicatat (${p.method}) · status Lunas`)
    return inv.id
  }
  const sendReminder = (roomNos: number[], tpl = "Template Tunggakan") => {
    const list = rooms.filter((r) => roomNos.includes(r.no) && r.tenant)
    if (!list.length) return
    wa.push(
      list.map((r) => ({
        time: nowTime(),
        room: r.no,
        name: shortName(r.tenant),
        tpl,
      })),
    )
    notify(
      list.length === 1
        ? `${tpl} dikirim ke ${list[0].tenant} (Kmr ${list[0].no}) via Fonnte`
        : `${tpl} dikirim ke ${list.length} penghuni via Fonnte`,
    )
  }

  // ---------- tenants ----------
  const checkIn = (f: CheckInInput) => {
    const id = `${propId}-t${f.roomNo}-${Date.now()}`
    const room = db.rooms[propId].find((r) => r.no === f.roomNo)!
    const dueDay = Math.min(28, Number(f.start.slice(8, 10)))
    const tenant: Tenant = {
      id,
      propId,
      roomNo: f.roomNo,
      name: f.name,
      phone: f.phone,
      emergency: f.emergency,
      start: f.start,
      dueDay,
      bank: "BCA",
      ktp: f.ktp,
      active: true,
    }
    setDb((d) => ({
      ...d,
      tenants: [...d.tenants, tenant],
      deposits: [
        ...d.deposits,
        {
          id: `dep-${id}`,
          propId,
          roomNo: f.roomNo,
          tenantId: id,
          tenantName: f.name,
          amount: f.deposit,
          date: f.start,
          status: "locked",
        },
      ],
      invoices: [
        ...d.invoices,
        {
          id: `INV/2611/${f.roomNo}-${String(Date.now()).slice(-4)}`,
          propId,
          roomNo: f.roomNo,
          tenantId: id,
          period: PERIOD,
          amount: room.price,
          status: "paid",
          paidOn: TODAY,
          method: f.method,
        },
      ],
    }))
    pushWa(f.roomNo, shortName(f.name), "Selamat Datang & Kontrak Digital")
    notify(
      `${f.name} check-in ke Kamar ${f.roomNo} · deposit & sewa bulan pertama tercatat`,
    )
  }
  const updateTenant = (id: string, p: Partial<Tenant>) => {
    setDb((d) => ({
      ...d,
      tenants: d.tenants.map((t) => (t.id === id ? { ...t, ...p } : t)),
      deposits: p.name
        ? d.deposits.map((x) =>
            x.tenantId === id ? { ...x, tenantName: p.name! } : x,
          )
        : d.deposits,
    }))
    notify("Data penghuni diperbarui")
  }
  const checkout = (
    roomNo: number,
    c: {
      deductions: { name: string; amount: number }[]
      bank: string
      account: string
    },
  ) => {
    const t = db.tenants.find(
      (x) => x.active && x.propId === propId && x.roomNo === roomNo,
    )
    if (!t) return null
    const dep = db.deposits.find(
      (x) => x.tenantId === t.id && x.status !== "refunded",
    )
    const total = c.deductions.reduce((s, x) => s + x.amount, 0)
    setDb((d) => ({
      ...d,
      tenants: d.tenants.map((x) =>
        x.id === t.id
          ? { ...x, active: false, roomNo: null, endDate: TODAY }
          : x,
      ),
      invoices: d.invoices.map((i) =>
        i.tenantId === t.id && i.period === PERIOD && i.status !== "paid"
          ? { ...i, status: "void" }
          : i,
      ),
      deposits: d.deposits.map((x) =>
        x.id === dep?.id
          ? {
              ...x,
              status: "refunded",
              deductions: c.deductions,
              refund: Math.max(0, x.amount - total),
              refundBank: `${c.bank} · ${c.account}`,
              refundDate: TODAY,
            }
          : x,
      ),
    }))
    setDrawerNo(null)
    setCheckoutNo(null)
    pushWa(roomNo, shortName(t.name), "Berita Acara Checkout")
    return dep?.id ?? null
  }
  const setDepositStatus = (id: string, status: "locked" | "dispute") => {
    setDb((d) => ({
      ...d,
      deposits: d.deposits.map((x) => (x.id === id ? { ...x, status } : x)),
    }))
    notify(
      status === "dispute"
        ? "Deposit ditandai sengketa · dana ditahan hingga mediasi selesai"
        : "Status deposit dikembalikan ke Terkunci Aman",
    )
  }

  // ---------- rooms ----------
  const setRoomPrice = (no: number, price: number) => {
    const inv = findInvoice(no)
    setDb((d) => ({
      ...d,
      rooms: {
        ...d.rooms,
        [propId]: d.rooms[propId].map((r) =>
          r.no === no ? { ...r, price } : r,
        ),
      },
      invoices:
        inv && inv.status !== "paid"
          ? d.invoices.map((i) =>
              i.id === inv.id ? { ...i, amount: price } : i,
            )
          : d.invoices,
    }))
    notify(`Tarif Kamar ${no} diperbarui`)
  }
  const moveRoom = (from: number, to: number) => {
    const t = db.tenants.find(
      (x) => x.active && x.propId === propId && x.roomNo === from,
    )
    if (!t) return
    setDb((d) => ({
      ...d,
      tenants: d.tenants.map((x) => (x.id === t.id ? { ...x, roomNo: to } : x)),
      invoices: d.invoices.map((i) =>
        i.tenantId === t.id && i.period === PERIOD ? { ...i, roomNo: to } : i,
      ),
      deposits: d.deposits.map((x) =>
        x.tenantId === t.id && x.status !== "refunded"
          ? { ...x, roomNo: to }
          : x,
      ),
    }))
    setDrawerNo(to)
    notify(`${t.name} dipindahkan dari Kamar ${from} ke Kamar ${to}`)
  }

  // ---------- finance ----------
  const addExpense = (e: Omit<Expense, "id" | "propId">) => {
    setDb((d) => ({
      ...d,
      expenses: [
        ...d.expenses,
        { ...e, id: `${propId}-e${Date.now()}`, propId },
      ],
    }))
  }
  const removeExpense = (id: string) => {
    setDb((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }))
    notify("Entri pengeluaran dihapus")
  }

  // ---------- maintenance ----------
  const createTicket = (
    t: Omit<Ticket, "id" | "propId" | "status" | "createdAt">,
    sendWa: boolean,
  ) => {
    setDb((d) => ({
      ...d,
      tickets: [
        ...d.tickets,
        {
          ...t,
          id: `TKT-${String(Date.now()).slice(-5)}`,
          propId,
          status: "open",
          createdAt: TODAY,
        },
      ],
    }))
    if (sendWa) pushWa(t.room, t.vendor, "Tiket Servis Vendor")
    notify(
      `Tiket ${t.category}${
        t.room ? ` Kamar ${t.room}` : " Area Umum"
      } dibuat · ${t.vendor} dijadwalkan${
        sendWa ? " · detail dikirim via WA" : ""
      }`,
    )
  }
  const completeTicket = (id: string) => {
    const t = db.tickets.find((x) => x.id === id)
    if (!t) return
    setDb((d) => ({
      ...d,
      tickets: d.tickets.map((x) =>
        x.id === id ? { ...x, status: "done" } : x,
      ),
      units:
        t.category === "AC" && t.room
          ? {
              ...d.units,
              [propId]: d.units[propId].map((u) =>
                u.room === t.room ? { ...u, last: TODAY } : u,
              ),
            }
          : d.units,
      expenses: [
        ...d.expenses,
        {
          id: `${propId}-e${Date.now()}`,
          propId,
          date: TODAY,
          category: t.category === "AC" ? "Servis AC" : "Perbaikan",
          desc: `${t.category === "AC" ? "Cuci/Servis AC" : t.job} ${
            t.room ? `Kamar ${t.room}` : "Area Umum"
          } (${t.vendor})`,
          amount: t.cost,
          source: "Tiket Servis",
        },
      ],
    }))
    notify(
      `Tiket ${
        t.room ? `Kamar ${t.room}` : "Area Umum"
      } selesai · biaya Rp${t.cost.toLocaleString("id-ID")} dicatat ke Buku Kas`,
    )
  }

  // ---------- staff ----------
  const toggleTask = (id: string) =>
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id ? { ...t, done: !t.done, at: !t.done ? nowTime() : "" } : t,
      ),
    )
  const generateNext = () => {
    setNextGenerated((g) => ({ ...g, [propId]: true }))
    notify(
      `${stats.occupied} tagihan periode Desember 2026 dibuat & dijadwalkan kirim via WhatsApp`,
    )
  }

  const propertySummaries = useMemo(
    () =>
      PROPERTIES.map((p) => ({
        ...p,
        rooms: db.rooms[p.id].length,
        overdue: db.invoices.filter(
          (i) =>
            i.propId === p.id && i.period === PERIOD && i.status === "overdue",
        ).length,
      })),
    [db],
  )

  return {
    db,
    propId,
    property,
    propertySummaries,
    switchProperty,
    rooms,
    tenants,
    invoices,
    deposits,
    expenses,
    units,
    tickets,
    stats,
    page,
    navigate,
    financeTab,
    setFinanceTab,
    drawerNo,
    openDrawer,
    checkoutNo,
    openCheckout,
    modal,
    openModal,
    toast,
    notify,
    wa,
    tasks,
    toggleTask,
    nextGenerated: !!nextGenerated[propId],
    generateNext,
    approvePayment,
    rejectPayment,
    recordPayment,
    sendReminder,
    checkIn,
    updateTenant,
    checkout,
    setDepositStatus,
    setRoomPrice,
    moveRoom,
    addExpense,
    removeExpense,
    mobileMenuOpen,
    setMobileMenuOpen,
    userRole,
    setUserRole,
    createTicket,
    completeTicket,
  }
}

export type Store = ReturnType<typeof useStoreValue>
const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error("useStore must be used inside StoreProvider")
  return s
}
