import AppShell from "@/components/AppShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cockpit Operasional — SUPERKOST",
  description: "Pusat kendali operasional rumah kost mandiri real-time.",
};

export default function AppDashboardPage() {
  return <AppShell />;
}

