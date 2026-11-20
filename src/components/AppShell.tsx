"use client";

import { useCallback } from "react";
import { StoreProvider, useStore } from "@/store/store";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileNav from "./navigation/MobileNav";
import MobileDrawer from "./navigation/MobileDrawer";
import RoomDrawer from "./RoomDrawer";
import CheckoutModal from "./CheckoutModal";
import BillingPage from "./BillingPage";
import MaintenancePage from "./MaintenancePage";
import WhatsAppPage from "./WhatsAppPage";
import DashboardPage from "./pages/DashboardPage";
import RoomsPage from "./pages/RoomsPage";
import TenantsPage from "./pages/TenantsPage";
import DepositsPage from "./pages/DepositsPage";
import FinancePage from "./pages/FinancePage";
import StaffPage from "./pages/StaffPage";
import CheckInModal from "./modals/CheckInModal";
import PaymentModal from "./modals/PaymentModal";
import TicketModal from "./modals/TicketModal";
import RoomActionModal from "./modals/RoomActionModal";
import DocumentModal from "./modals/DocumentModal";
import { rupiah } from "@/lib/data";

function Shell() {
  const s = useStore();
  const drawerRoom =
    s.rooms.find((r) => r.no === s.drawerNo && r.status !== "vacant") ?? null;
  const checkoutRoom =
    s.rooms.find((r) => r.no === s.checkoutNo && r.status !== "vacant") ?? null;
  const { openDrawer, openCheckout, openModal } = s;
  const closeDrawer = useCallback(() => openDrawer(null), [openDrawer]);
  const closeCheckout = useCallback(
    () => openCheckout(null),
    [openCheckout]
  );
  const closeModal = useCallback(() => openModal(null), [openModal]);
  const m = s.modal;

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
  }[s.page];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#141413] transition-colors">
      {/* Desktop fixed sidebar */}
      <Sidebar />

      {/* Mobile slide-out drawer */}
      <MobileDrawer />

      {/* Main container with responsive padding */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen pb-20 lg:pb-0">
        <Topbar />
        <main
          key={`${s.page}-${s.propId}`}
          className="p-3 sm:p-6 flex-1 max-w-[1600px] w-full mx-auto animate-fade-in"
        >
          {page}
        </main>
      </div>

      {/* Mobile bottom navigation bar for quick access */}
      <MobileNav />

      {/* Global Room detail drawer */}
      <RoomDrawer
        room={drawerRoom}
        onClose={closeDrawer}
        onCheckout={(r) => s.openCheckout(r.no)}
      />

      {/* Checkout clearance modal */}
      <CheckoutModal
        room={checkoutRoom}
        onClose={closeCheckout}
        onConfirm={(r, refund, c) => {
          const depId = s.checkout(r.no, c);
          s.notify(
            `Kamar ${r.no} kini Kosong (Siap Huni) · refund ${rupiah(
              refund
            )} ke ${c.bank} · deposit Cleared`
          );
          if (depId)
            s.openModal({
              type: "doc",
              doc: { kind: "clearance", depositId: depId },
            });
        }}
      />

      {/* Modals */}
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

      {/* Toast notification */}
      {s.toast && (
        <div
          key={s.toast.id}
          className="fixed bottom-20 lg:bottom-6 left-1/2 z-[70] max-w-[90vw] sm:max-w-[640px] -translate-x-1/2 animate-slide-up rounded-xl bg-[#141413]/95 backdrop-blur-md px-4 py-3 text-center text-xs sm:text-sm font-semibold text-[#FAF8F5] shadow-2xl border border-stone-800"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#C5A572]" />
            <span>{s.toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppShell() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

