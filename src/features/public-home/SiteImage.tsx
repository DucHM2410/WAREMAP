import { useEffect, useState } from "react"

import { WarehouseIllustration } from "./WarehouseIllustration"

export function EditableImage({
  src,

  alt,

  compact = false,
}: {
  src: string

  alt: string

  compact?: boolean
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [src])

  return src && !failed ? (
    <img
      className="wm-content-image"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <WarehouseIllustration compact={compact} />
  )
}
