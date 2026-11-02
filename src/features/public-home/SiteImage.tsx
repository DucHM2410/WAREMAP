import { useEffect, useState } from "react"

import { WarehouseIllustration } from "./WarehouseIllustration"
import { isSitePhoto, isSystemCapture } from "./sitePhotos"

export function EditableImage({
  src,

  alt,

  compact = false,
  priority = false,
}: {
  src: string

  alt: string

  compact?: boolean
  priority?: boolean
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [src])

  return src && !failed ? (
    <img
      className={`wm-content-image ${isSitePhoto(src) ? "wm-content-photo" : ""} ${isSystemCapture(src) ? "wm-content-capture" : ""}`}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  ) : (
    <WarehouseIllustration compact={compact} />
  )
}
