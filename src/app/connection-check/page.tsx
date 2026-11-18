"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Property = { id: string; slug: string; name: string };

export default function ConnectionCheckPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [message, setMessage] = useState("Memeriksa konfigurasi...");
  const [busy, setBusy] = useState(false);

  async function loadProperties() {
    if (!supabase) {
      setMessage("Konfigurasi Supabase belum lengkap. Periksa .env.local dan restart server.");
      return;
    }
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setMessage(`Gagal membaca sesi: ${sessionError.message}`);
      return;
    }
    const user = sessionData.session?.user;
    setUserEmail(user?.email ?? null);
    if (!user) {
      setProperties([]);
      setMessage("Client Supabase siap. Login diperlukan untuk menguji query yang dilindungi RLS.");
      return;
    }
    const { data, error } = await supabase
      .from("properties")
      .select("id,slug,name")
      .order("name");
    if (error) {
      setProperties([]);
      setMessage(`Login berhasil, tetapi query properties gagal: ${error.message}`);
      return;
    }
    setProperties(data ?? []);
    setMessage(`Terhubung ke Supabase dan query berhasil (${data?.length ?? 0} property terlihat oleh akun ini).`);
  }

  useEffect(() => {
    void loadProperties();
    const client = supabase;
    if (!client) return;
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUserEmail(session?.user.email ?? null);
        void client.from("properties").select("id,slug,name").order("name")
          .then(({ data, error }) => {
            if (error) {
              setProperties([]);
              setMessage(`Login berhasil, tetapi query properties gagal: ${error.message}`);
              return;
            }
            setProperties(data ?? []);
            setMessage(`Terhubung ke Supabase dan query berhasil (${data?.length ?? 0} property terlihat oleh akun ini).`);
          });
      } else if (event === "SIGNED_OUT") {
        setUserEmail(null);
        setProperties([]);
        setMessage("Logout berhasil. Client Supabase masih siap.");
      }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("Mencoba login...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setMessage(`Login gagal: ${error.message}`);
      return;
    }
    await loadProperties();
  }

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(`Logout gagal: ${error.message}`);
    else {
      setProperties([]);
      setUserEmail(null);
      setMessage("Logout berhasil. Client Supabase masih siap.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">SUPERKOST · backend check</p>
        <h1 className="mt-2 text-3xl font-bold">Tes koneksi Supabase</h1>
        <p className="mt-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">{message}</p>

        {!userEmail ? (
          <form onSubmit={signIn} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">Email
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="block text-sm font-medium">Password
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <button disabled={busy || !supabase} className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
              {busy ? "Menghubungkan..." : "Login & tes query"}
            </button>
          </form>
        ) : (
          <div className="mt-6">
            <p className="text-sm text-slate-600">Login sebagai <strong>{userEmail}</strong></p>
            <button onClick={signOut} className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Keluar</button>
            <h2 className="mt-6 font-semibold">Property yang dapat dibaca</h2>
            {properties.length ? <ul className="mt-2 list-inside list-disc text-sm">{properties.map((p) => <li key={p.id}>{p.name} <span className="text-slate-500">({p.slug}, {p.id})</span></li>)}</ul> : <p className="mt-2 text-sm text-slate-600">Tidak ada property terlihat. Pastikan seed berhasil dan akun ini pemilik/anggota property.</p>}
          </div>
        )}
        <p className="mt-8 text-xs text-slate-500">Halaman ini menguji Auth dan SELECT melalui publishable key serta RLS. Dashboard utama masih memakai data mock.</p>
      </div>
    </main>
  );
}
