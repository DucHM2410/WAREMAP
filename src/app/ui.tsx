import { X, Box, ArrowRight, Search } from "lucide-react"
import {
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { useApp } from "./store"
export function Button({
  children,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger"
}) {
  return (
    <button
      type="button"
      {...props}
      className={`button ${variant} ${props.className || ""}`}
    >
      {children}
    </button>
  )
}
export function Brand() {
  return (
    <span className="brand">
      <span className="brand-icon">
        <Box size={23} />
      </span>
      <span>
        WareMap <b>System</b>
      </span>
    </span>
  )
}
export function PageTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: string
}) {
  return <span className={`badge ${tone}`}>{children}</span>
}
export function Empty({
  title = "Chưa có dữ liệu",
  children,
  action,
}: {
  title?: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Box size={28} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  )
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Tìm kiếm…",
}: {
  value: string
  onChange: (s: string) => void
  placeholder?: string
}) {
  return (
    <label className="search-input">
      <Search size={17} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Xóa tìm kiếm">
          <X size={15} />
        </button>
      )}
    </label>
  )
}
export function Modal({
  title,
  children,
  close,
}: {
  title: string
  children: ReactNode
  close: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const node = dialog.current
    node?.showModal()
    return () => node?.close()
  }, [])
  return createPortal(
    <dialog
      ref={dialog}
      className="modal"
      onCancel={close}
      onClick={(e) => {
        if (e.target === dialog.current) close()
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <Button variant="ghost" onClick={close} aria-label="Đóng">
          <X size={20} />
        </Button>
      </div>
      {children}
    </dialog>,
    document.body,
  )
}
export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <div className="panel-heading">
          <h2>{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
export function LinkButton({
  children,
  to,
}: {
  children: ReactNode
  to: Parameters<ReturnType<typeof useApp>["go"]>[0]
}) {
  const { go } = useApp()
  return (
    <Button variant="ghost" onClick={() => go(to)}>
      {children}
      <ArrowRight size={16} />
    </Button>
  )
}
export function Download({
  name,
  rows,
}: {
  name: string
  rows: (string | number)[][]
}) {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        const blob = new Blob(
          [
            "\uFEFF" +
              rows
                .map((row) =>
                  row
                    .map((c) => `"${String(c).replace(/"/g, '""')}"`)
                    .join(","),
                )
                .join("\r\n"),
          ],
          { type: "text/csv;charset=utf-8;" },
        )
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = name
        a.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }}
    >
      Tải bảng CSV
    </Button>
  )
}
