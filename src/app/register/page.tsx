import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun Pengelola Baru — SUPERKOST",
  description: "Daftar akun pengelola kos baru dan mulai uji coba gratis 14 hari tanpa kartu kredit.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

