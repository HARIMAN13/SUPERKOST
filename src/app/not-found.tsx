import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-center">
      <h1 className="font-display text-4xl font-extrabold text-[#141413]">404</h1>
      <p className="mt-2 text-sm text-slate-500">
        Halaman yang Anda tuju tidak ditemukan.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-[#141413] px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
        >
          Ke Beranda
        </Link>
        <Link
          href="/app"
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Ke Cockpit
        </Link>
      </div>
    </div>
  );
}

