import { ChevronDown, X } from "lucide-react"
import { useEffect, type ReactNode } from "react"

export const inputCls =
  "h-9 w-full rounded-lg border border-[#E2E8F0] bg-white px-3 text-[12.5px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#6366F1] focus:ring-3 focus:ring-[#6366F1]/15 disabled:bg-slate-50 disabled:text-slate-500"

export function ModalShell({
  title,
  subtitle,
  icon,
  onClose,
  width = 560,
  dark = true,
  footer,
  children,
  z = "z-50",
}: {
  title: string
  subtitle?: ReactNode
  icon?: ReactNode
  onClose: () => void
  width?: number
  dark?: boolean
  footer?: ReactNode
  children: ReactNode
  z?: string
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation()
        onClose()
      }
    }
    window.addEventListener("keydown", k, true)
    return () => window.removeEventListener("keydown", k, true)
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 ${z} flex items-center justify-center p-6`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#0F0D2E]/50 backdrop-blur-[3px] animate-[fade_.15s_ease-out]"
      />
      <div
        style={{ width }}
        className="relative flex max-h-[calc(100vh-48px)] flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl shadow-indigo-950/25 animate-[pop_.18s_ease-out]"
      >
        <header
          className={`flex items-center gap-3 px-5 py-4 ${
            dark ? "bg-[#1E1B4B]" : "border-b border-[#E2E8F0]"
          }`}
        >
          {icon && (
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                dark
                  ? "bg-white/10 text-indigo-100 ring-1 ring-white/10"
                  : "bg-[#F5F3FF] text-[#4F46E5]"
              }`}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h3
              className={`font-display text-[15px] font-bold ${
                dark ? "text-white" : "text-[#1E1B4B]"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className={`mt-0.5 text-[11.5px] ${
                  dark ? "text-indigo-200/85" : "text-slate-500"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className={`flex size-8 items-center justify-center rounded-lg ${
              dark
                ? "text-indigo-200 hover:bg-white/10 hover:text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

export function Field({
  label,
  error,
  hint,
  children,
  className = "",
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[11.5px] font-medium text-slate-600">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] text-rose-600">{error}</span>
      ) : (
        hint && (
          <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>
        )
      )}
    </label>
  )
}

export function SelectBox({
  value,
  onChange,
  children,
  disabled,
}: {
  value: string | number
  onChange: (v: string) => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-8`}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export function MoneyInput({
  value,
  onChange,
  invalid,
}: {
  value: number
  onChange: (n: number) => void
  invalid?: boolean
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400">
        Rp
      </span>
      <input
        inputMode="numeric"
        value={value ? value.toLocaleString("id-ID") : ""}
        placeholder="0"
        onChange={(e) =>
          onChange(Number(e.target.value.replace(/\D/g, "").slice(0, 10)) || 0)
        }
        className={`${inputCls} pl-9 tabular-nums ${
          invalid ? "border-[#F43F5E]" : ""
        }`}
      />
    </div>
  )
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "success" | "danger" | "dangerOutline" | "dark" | "amber"
  disabled?: boolean
  className?: string
  type?: "button" | "submit"
}) {
  const v = {
    primary: "bg-[#4F46E5] text-white hover:bg-[#4338CA]",
    secondary:
      "border border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50",
    success: "bg-[#10B981] text-white hover:bg-[#059669]",
    danger: "bg-[#F43F5E] text-white hover:bg-[#E11D48]",
    dangerOutline: "border border-[#F43F5E] text-[#E11D48] hover:bg-[#FFF1F2]",
    dark: "bg-[#1E1B4B] text-white hover:bg-[#312E81]",
    amber: "bg-[#F59E0B] text-[#1E1B4B] hover:bg-[#D97706] hover:text-white",
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-[12.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${v} ${className}`}
    >
      {children}
    </button>
  )
}

export function PageHeader({
  crumb,
  title,
  actions,
}: {
  crumb: string
  title: string
  actions?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div className="min-w-0">
        <p className="text-[11.5px] font-medium text-slate-500">{crumb}</p>
        <h1 className="mt-0.5 font-display text-[21px] font-bold tracking-tight text-[#1E1B4B]">
          {title}
        </h1>
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  )
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T
  onChange: (v: T) => void
  items: { k: T; label: string; n?: number; dot?: string }[]
}) {
  return (
    <div className="flex rounded-lg bg-[#F1F5F9] p-0.5">
      {items.map((t) => (
        <button
          key={t.k}
          onClick={() => onChange(t.k)}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
            value === t.k
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {t.dot && <span className={`size-1.5 rounded-full ${t.dot}`} />}
          {t.label}
          {t.n !== undefined && (
            <span className="tabular-nums opacity-70">({t.n})</span>
          )}
        </button>
      ))}
    </div>
  )
}

export const Pill = ({
  cls,
  children,
}: {
  cls: string
  children: ReactNode
}) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-semibold ring-1 ring-inset ${cls}`}
  >
    {children}
  </span>
)
export const tone = {
  green: "bg-[#10B981]/10 text-emerald-700 ring-[#10B981]/25",
  red: "bg-[#F43F5E]/10 text-rose-700 ring-[#F43F5E]/25",
  amber: "bg-[#F59E0B]/12 text-amber-700 ring-[#F59E0B]/30",
  violet: "bg-[#F5F3FF] text-[#4F46E5] ring-[#C7D2FE]",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
}

export function Avatar({
  name,
  size = "size-8",
}: {
  name: string
  size?: string
}) {
  const initials = name
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-[#F5F3FF] text-[11px] font-bold text-[#4F46E5] ring-1 ring-[#C7D2FE]`}
    >
      {initials}
    </span>
  )
}
