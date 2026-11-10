import { useCallback } from "react"
import { StoreProvider, useStore } from "./store"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import RoomDrawer from "./components/RoomDrawer"
import CheckoutModal from "./components/CheckoutModal"
import BillingPage from "./components/BillingPage"
import MaintenancePage from "./components/MaintenancePage"
import WhatsAppPage from "./components/WhatsAppPage"
import DashboardPage from "./components/pages/DashboardPage"
import RoomsPage from "./components/pages/RoomsPage"
import TenantsPage from "./components/pages/TenantsPage"
import DepositsPage from "./components/pages/DepositsPage"
import FinancePage from "./components/pages/FinancePage"
import StaffPage from "./components/pages/StaffPage"
import CheckInModal from "./components/modals/CheckInModal"
import PaymentModal from "./components/modals/PaymentModal"
import TicketModal from "./components/modals/TicketModal"
import RoomActionModal from "./components/modals/RoomActionModal"
import DocumentModal from "./components/modals/DocumentModal"
import { rupiah } from "./data"

function Shell() {
  const s = useStore()
  const drawerRoom =
    s.rooms.find((r) => r.no === s.drawerNo && r.status !== "vacant") ?? null
  const checkoutRoom =
    s.rooms.find((r) => r.no === s.checkoutNo && r.status !== "vacant") ?? null
  const closeDrawer = useCallback(() => s.openDrawer(null), [s.openDrawer]) // eslint-disable-line react-hooks/exhaustive-deps
  const closeCheckout = useCallback(
    () => s.openCheckout(null),
    [s.openCheckout],
  ) // eslint-disable-line react-hooks/exhaustive-deps
  const closeModal = useCallback(() => s.openModal(null), [s.openModal]) // eslint-disable-line react-hooks/exhaustive-deps
  const m = s.modal

  const page = {
    dashboard: <DashboardPage />,
    rooms: <RoomsPage />,
    tenants: <TenantsPage />,
    billing: (
      <BillingPage
        key={s.propId}
        rooms={s.rooms}
        onApprove={s.approvePayment}
        onReject={s.rejectPayment}
        notify={s.notify}
      />
    ),
    deposits: <DepositsPage />,
    finance: <FinancePage />,
    maintenance: <MaintenancePage />,
    staff: <StaffPage />,
    whatsapp: <WhatsAppPage wa={s.wa} rooms={s.rooms} notify={s.notify} />,
  }[s.page]

  return (
    <div className="min-h-screen min-w-[1440px] bg-[#F8FAFC] text-slate-900">
      <Sidebar />
      <div className="pl-[260px]">
        <Topbar />
        <main key={`${s.page}-${s.propId}`} className="p-6">
          {page}
        </main>
      </div>

      <RoomDrawer
        room={drawerRoom}
        onClose={closeDrawer}
        onCheckout={(r) => s.openCheckout(r.no)}
      />
      <CheckoutModal
        room={checkoutRoom}
        onClose={closeCheckout}
        onConfirm={(r, refund, c) => {
          const depId = s.checkout(r.no, c)
          s.notify(
            `Kamar ${r.no} kini Kosong (Siap Huni) · refund ${rupiah(refund)} ke ${c.bank} · deposit Cleared`,
          )
          if (depId)
            s.openModal({
              type: "doc",
              doc: { kind: "clearance", depositId: depId },
            })
        }}
      />

      {m?.type === "checkIn" && (
        <CheckInModal
          key={`${m.roomNo}-${m.tenantId}`}
          roomNo={m.roomNo}
          tenantId={m.tenantId}
          onClose={closeModal}
        />
      )}
      {m?.type === "payment" && (
        <PaymentModal
          key={m.roomNo}
          roomNo={m.roomNo}
          method={m.method}
          onClose={closeModal}
        />
      )}
      {m?.type === "ticket" && (
        <TicketModal
          key={`${m.roomNo}`}
          roomNo={m.roomNo}
          category={m.category}
          onClose={closeModal}
        />
      )}
      {m?.type === "roomAction" && (
        <RoomActionModal kind={m.kind} roomNo={m.roomNo} onClose={closeModal} />
      )}
      {m?.type === "doc" && <DocumentModal doc={m.doc} onClose={closeModal} />}

      {s.toast && (
        <div
          key={s.toast.id}
          className="fixed bottom-6 left-1/2 z-[70] max-w-[640px] -translate-x-1/2 animate-[pop_.18s_ease-out] rounded-lg bg-[#1E1B4B] px-4 py-2.5 text-center text-[12.5px] font-medium text-white shadow-lg"
        >
          {s.toast.msg}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
