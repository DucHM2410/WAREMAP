import {
  ArrowDown,
  ArrowUp,
  Check,
  Download,
  Eye,
  FileText,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react"

import { useEffect, useRef, useState, type ChangeEvent } from "react"

import { useApp } from "../../app/store"

import { Button, Modal, PageTitle } from "../../app/ui"

import { PublicSite } from "../public-home/PublicHomeScreen"

import { useSiteContent } from "./SiteContentContext"

import { DEFAULT_SITE_CONTENT } from "./defaultContent"

import {
  PAGE_LABELS,
  validateContent,
  validImageSource,
  type PublicPage,
  type SiteContent,
} from "./types"

import "./editor.css"

function ImageField({
  value,

  alt,

  onChange,

  onAlt,

  onError,
}: {
  value: string

  alt: string

  onChange: (value: string) => void

  onAlt: (value: string) => void

  onError: (message: string) => void
}) {
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 400000
    ) {
      onError("Chọn ảnh JPG, PNG hoặc WebP tối đa 400 KB, hoặc dùng URL HTTPS.")

      return
    }

    const reader = new FileReader()

    reader.onerror = () => onError("Không đọc được ảnh. Vui lòng thử lại.")

    reader.onload = () => onChange(String(reader.result))

    reader.readAsDataURL(file)
  }

  return (
    <fieldset className="cms-image-field">
      <legend>
        <ImagePlus size={16} />
        Hình ảnh
      </legend>
      <label className="field">
        URL ảnh (HTTPS)
        <input
          aria-label="URL ảnh"
          placeholder="https://… hoặc tải ảnh bên dưới"
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value.trim())}
        />
      </label>
      <label className="cms-upload">
        <Upload size={16} />
        Tải ảnh lên
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={upload}
        />
      </label>
      <small>
        JPG, PNG, WebP · Tối đa 400 KB. Để trống để dùng hình minh họa mặc định.
      </small>
      {value && validImageSource(value) && (
        <div className="cms-image-preview">
          <img src={value} alt={alt} />
          <Button variant="ghost" onClick={() => onChange("")}>
            <X size={14} />
            Gỡ ảnh
          </Button>
        </div>
      )}
      <label className="field">
        Mô tả ảnh (cho người dùng trình đọc màn hình)
        <input value={alt} onChange={(e) => onAlt(e.target.value)} />
      </label>
    </fieldset>
  )
}

export default function HomepageEditorScreen() {
  const { role, guardNavigation, notify } = useApp()

  const { content, readDraft, saveDraft, apply } = useSiteContent()

  const [draft, setDraft] = useState<SiteContent>(() =>
    structuredClone(content),
  )

  const [baseline, setBaseline] = useState(() => JSON.stringify(content))

  const [page, setPage] = useState<PublicPage>("home")

  const [selected, setSelected] = useState("hero")

  const [preview, setPreview] = useState(false)

  const [error, setError] = useState("")

  const [message, setMessage] = useState("")

  const [confirmReset, setConfirmReset] = useState(false)

  const jsonInput = useRef<HTMLInputElement>(null)

  const dirty = JSON.stringify(draft) !== baseline

  useEffect(() => {
    guardNavigation(
      dirty
        ? () =>
            window.confirm(
              "Nội dung trang chủ chưa lưu. Rời khỏi trình chỉnh sửa?",
            )
        : null,
    )

    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault()
    }

    window.addEventListener("beforeunload", beforeUnload)

    return () => {
      guardNavigation(null)

      window.removeEventListener("beforeunload", beforeUnload)
    }
  }, [dirty, guardNavigation])

  if (!["owner", "platform"].includes(role))
    return <p>Bạn không có quyền chỉnh sửa website.</p>

  const current = draft.pages[page]

  const section = current.sections.find((s) => s.id === selected)

  const edit = (fn: (copy: SiteContent) => void) => {
    setDraft((prev) => {
      const copy = structuredClone(prev)

      fn(copy)

      return copy
    })

    setMessage("")

    setError("")
  }

  const setPageField = (
    key: "title" | "description" | "eyebrow" | "image" | "imageAlt",

    value: string,
  ) =>
    edit((copy) => {
      copy.pages[page][key] = value
    })

  const setSectionField = (
    key: "title" | "description" | "eyebrow" | "image" | "imageAlt",

    value: string,
  ) =>
    edit((copy) => {
      const s = copy.pages[page].sections.find((s) => s.id === selected)

      if (s) s[key] = value
    })

  const save = (publish: boolean) => {
    if (!validateContent(draft)) {
      setError(
        "Kiểm tra URL ảnh: chỉ chấp nhận HTTPS hoặc ảnh đã tải lên. Nội dung cần đúng cấu trúc.",
      )

      return
    }

    try {
      if (publish) apply(draft)
      else saveDraft(draft)

      setBaseline(JSON.stringify(draft))

      setError("")

      setMessage(
        publish
          ? "Đã áp dụng nội dung trên trình duyệt này. Website của người khác chưa thay đổi."
          : "Đã lưu nháp trên trình duyệt này.",
      )

      notify(publish ? "Đã áp dụng nội dung cục bộ." : "Đã lưu bản nháp.")
    } catch {
      setError(
        "Không lưu được nội dung. Bộ nhớ trình duyệt có thể đã đầy hoặc bị chặn. Giảm ảnh tải lên hoặc xuất JSON để giữ bản chỉnh sửa.",
      )
    }
  }

  const exportContent = () => {
    if (!validateContent(draft)) {
      setError("Nội dung chưa hợp lệ để xuất. Hãy kiểm tra URL ảnh.")

      return
    }

    const url = URL.createObjectURL(
      new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }),
    )

    const a = document.createElement("a")

    a.href = url

    a.download = "waremap-website-content.json"

    a.click()

    URL.revokeObjectURL(url)

    setMessage(
      "Đã xuất JSON. Có thể nhập lại trên máy khác hoặc bàn giao cho người triển khai website.",
    )
  }

  const importContent = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    if (file.size > 3500000) {
      setError("File JSON phải nhỏ hơn 3.5 MB.")

      return
    }

    try {
      const data: unknown = JSON.parse(await file.text())

      if (!validateContent(data)) throw new Error("invalid")

      if (
        dirty &&
        !window.confirm("Thay nội dung chưa lưu bằng file JSON này?")
      )
        return

      setDraft(data)

      setSelected("hero")

      setError("")

      setMessage(
        "Đã nhập nội dung vào bản chỉnh sửa. Xem trước rồi áp dụng khi sẵn sàng.",
      )
    } catch {
      setError(
        "File không đúng cấu trúc nội dung WareMap hoặc chứa URL ảnh không hợp lệ.",
      )
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="QUẢN LÝ NỘI DUNG WEBSITE"
        title="Chỉnh sửa trang chủ"
        description="Cập nhật nội dung, hình ảnh và các trang ngành hàng mà không cần sửa mã nguồn."
        action={
          <Button variant="secondary" onClick={() => setPreview(!preview)}>
            <Eye size={16} />
            {preview ? "Tiếp tục chỉnh sửa" : "Xem trước"}
          </Button>
        }
      />
      <div className="cms-notice">
        <FileText size={20} />
        <div>
          <strong>Nội dung demo lưu trên trình duyệt này</strong>
          <p>
            Áp dụng để xem trên cùng trình duyệt. Dùng Xuất/Nhập JSON để chia sẻ
            bản nội dung; cần triển khai bản nội dung hoặc kết nối backend để
            cập nhật cho tất cả người xem.
          </p>
        </div>
      </div>
      <div className="cms-actions">
        <div className="cms-status">
          <i className={dirty ? "is-dirty" : ""} />
          {dirty ? "Có thay đổi chưa lưu" : "Bản chỉnh sửa đã lưu"}
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            if (
              !dirty ||
              window.confirm("Thay nội dung đang sửa bằng bản nháp đã lưu?")
            ) {
              setDraft(structuredClone(readDraft()))

              setSelected("hero")

              setMessage("Đã tải bản nháp.")
            }
          }}
        >
          Mở bản nháp
        </Button>
        <Button variant="secondary" onClick={exportContent}>
          <Download size={15} />
          Xuất JSON
        </Button>
        <Button variant="secondary" onClick={() => jsonInput.current?.click()}>
          <Upload size={15} />
          Nhập JSON
        </Button>
        <input
          ref={jsonInput}
          hidden
          type="file"
          accept="application/json,.json"
          onChange={importContent}
        />
        <Button variant="secondary" onClick={() => save(false)}>
          <Save size={15} />
          Lưu nháp
        </Button>
        <Button onClick={() => save(true)}>
          <Check size={16} />
          Áp dụng trên trình duyệt
        </Button>
      </div>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="callout success" role="status">
          {message}
        </p>
      )}
      <div
        className="cms-page-tabs"
        role="group"
        aria-label="Chọn trang cần sửa"
      >
        {Object.entries(PAGE_LABELS).map(([id, label]) => (
          <button
            key={id}
            aria-pressed={page === id}
            className={page === id ? "active" : ""}
            onClick={() => {
              setPage(id as PublicPage)

              setSelected("hero")
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {preview ? (
        <div className="cms-preview">
          <PublicSite key={page} embedded initialPage={page} content={draft} />
        </div>
      ) : (
        <div className="cms-layout">
          <aside className="cms-outline">
            <span className="eyebrow">CẤU TRÚC TRANG</span>
            <button
              className={selected === "general" ? "active" : ""}
              onClick={() => setSelected("general")}
            >
              Thông tin chung & chân trang
            </button>
            <button
              className={selected === "hero" ? "active" : ""}
              onClick={() => setSelected("hero")}
            >
              Mở đầu trang (Hero)
            </button>
            {current.sections.map((s) => (
              <button
                key={s.id}
                className={selected === s.id ? "active" : ""}
                onClick={() => setSelected(s.id)}
              >
                <span>{s.title}</span>
                {!s.visible && <small>Đang ẩn</small>}
              </button>
            ))}
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>
              Khôi phục thiết kế mặc định
            </Button>
          </aside>
          <section className="cms-form panel">
            {selected === "general" ? (
              <>
                <h2>Thông tin chung</h2>
                <label className="field">
                  Chữ trên nút đăng ký
                  <input
                    value={draft.ctaLabel}
                    maxLength={60}
                    onChange={(e) =>
                      edit((c) => {
                        c.ctaLabel = e.target.value
                      })
                    }
                  />
                </label>
                <label className="field">
                  Mô tả ở chân trang
                  <textarea
                    value={draft.footerDescription}
                    onChange={(e) =>
                      edit((c) => {
                        c.footerDescription = e.target.value
                      })
                    }
                  />
                </label>
                <label className="field">
                  Email liên hệ (để trống nếu chưa có)
                  <input
                    type="email"
                    value={draft.contactEmail}
                    onChange={(e) =>
                      edit((c) => {
                        c.contactEmail = e.target.value
                      })
                    }
                  />
                </label>
              </>
            ) : (
              <>
                <div className="cms-form-heading">
                  <h2>
                    {selected === "hero" ? "Mở đầu trang" : "Nội dung khối"}
                  </h2>
                  {section && (
                    <>
                      <label className="check-row">
                        <input
                          type="checkbox"
                          checked={section.visible}
                          onChange={(e) =>
                            edit((c) => {
                              c.pages[page].sections.find(
                                (s) => s.id === selected,
                              )!.visible = e.target.checked
                            })
                          }
                        />
                        Hiển thị khối
                      </label>
                      <div className="row">
                        {([-1, 1] as const).map((delta) => (
                          <Button
                            key={delta}
                            variant="ghost"
                            aria-label={
                              delta === -1
                                ? "Di chuyển khối lên"
                                : "Di chuyển khối xuống"
                            }
                            disabled={
                              delta === -1
                                ? current.sections[0]?.id === selected
                                : current.sections.at(-1)?.id === selected
                            }
                            onClick={() =>
                              edit((c) => {
                                const items = c.pages[page].sections

                                const at = items.findIndex(
                                  (s) => s.id === selected,
                                )
                                ;[items[at], items[at + delta]] = [
                                  items[at + delta],

                                  items[at],
                                ]
                              })
                            }
                          >
                            {delta === -1 ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {([
                  ["eyebrow", "Nhãn phía trên tiêu đề"],

                  ["title", "Tiêu đề"],

                  ["description", "Mô tả"],
                ] as const).map(([key, label]) => (
                  <label className="field" key={key}>
                    {label}
                    {key === "description" ? (
                      <textarea
                        value={(section || current)[key]}
                        maxLength={20000}
                        onChange={(e) =>
                          selected === "hero"
                            ? setPageField(key, e.target.value)
                            : setSectionField(key, e.target.value)
                        }
                      />
                    ) : (
                      <input
                        value={(section || current)[key]}
                        maxLength={500}
                        onChange={(e) =>
                          selected === "hero"
                            ? setPageField(key, e.target.value)
                            : setSectionField(key, e.target.value)
                        }
                      />
                    )}
                  </label>
                ))}
                <ImageField
                  value={(section || current).image}
                  alt={(section || current).imageAlt}
                  onChange={(v) =>
                    selected === "hero"
                      ? setPageField("image", v)
                      : setSectionField("image", v)
                  }
                  onAlt={(v) =>
                    selected === "hero"
                      ? setPageField("imageAlt", v)
                      : setSectionField("imageAlt", v)
                  }
                  onError={setError}
                />
                {section && (
                  <div className="cms-cards">
                    <h3>
                      {section.layout === "faq"
                        ? "Câu hỏi & câu trả lời"
                        : "Các thẻ nội dung"}
                    </h3>
                    {section.cards.map((card, i) => (
                      <div className="cms-card-edit" key={`${selected}-${i}`}>
                        <div className="row between">
                          <strong>
                            {section.layout === "faq" ? "Câu hỏi" : "Thẻ"}{" "}
                            {i + 1}
                          </strong>
                          <Button
                            variant="ghost"
                            aria-label={`Xóa thẻ ${i + 1}`}
                            onClick={() =>
                              edit((c) => {
                                c.pages[page].sections

                                  .find((s) => s.id === selected)!

                                  .cards.splice(i, 1)
                              })
                            }
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                        <label className="field">
                          Tiêu đề thẻ {i + 1}
                          <input
                            value={card.title}
                            onChange={(e) =>
                              edit((c) => {
                                c.pages[page].sections.find(
                                  (s) => s.id === selected,
                                )!.cards[i].title = e.target.value
                              })
                            }
                          />
                        </label>
                        <label className="field">
                          Nội dung thẻ {i + 1}
                          <textarea
                            value={card.text}
                            onChange={(e) =>
                              edit((c) => {
                                c.pages[page].sections.find(
                                  (s) => s.id === selected,
                                )!.cards[i].text = e.target.value
                              })
                            }
                          />
                        </label>
                      </div>
                    ))}
                    {section.layout !== "pricing" && (
                      <Button
                        variant="secondary"
                        disabled={section.cards.length >= 30}
                        onClick={() =>
                          edit((c) => {
                            c.pages[page].sections

                              .find((s) => s.id === selected)!

                              .cards.push({
                                title: "Nội dung mới",

                                text: "Mô tả nội dung tại đây.",
                              })
                          })
                        }
                      >
                        <Plus size={15} />
                        Thêm thẻ / câu hỏi
                      </Button>
                    )}
                    {section.layout === "pricing" && (
                      <p className="tiny muted">
                        Giá và quyền lợi các gói được hiển thị theo thiết kế
                        bảng giá.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
      {confirmReset && (
        <Modal
          title="Khôi phục bản mặc định?"
          close={() => setConfirmReset(false)}
        >
          <p>
            Nội dung đang chỉnh sửa sẽ được thay bằng thiết kế mặc định. Nội
            dung đã áp dụng chưa thay đổi cho đến khi bạn bấm Áp dụng.
          </p>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Giữ nội dung
            </Button>
            <Button
              onClick={() => {
                setDraft(structuredClone(DEFAULT_SITE_CONTENT))

                setSelected("hero")

                setConfirmReset(false)
              }}
            >
              Khôi phục bản chỉnh sửa
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
