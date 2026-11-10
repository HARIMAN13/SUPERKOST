import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk ke Akun — SUPERKOST",
  description: "Masuk ke back-office Superkost untuk mengelola kamar, tagihan, dan operasional rumah kost.",
};

export default function LoginPage() {
  return <LoginForm />;
}

