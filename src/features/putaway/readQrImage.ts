import jsQR from "jsqr"

export function readQrPixels(pixels: Uint8ClampedArray, width: number, height: number) {
  const result = jsQR(pixels, width, height, { inversionAttempts: "attemptBoth" })
  if (!result?.data) throw new Error("Không tìm thấy QR trong ảnh. Chọn ảnh nhãn rõ nét, đủ bốn góc và thử lại.")
  return result.data
}

export async function readQrImage(file: File) {
  if (!/image\/(png|jpeg)/i.test(file.type)) throw new Error("Chọn ảnh PNG hoặc JPG của nhãn QR.")
  if (file.size > 15 * 1024 * 1024) throw new Error("Ảnh quá lớn. Chọn ảnh nhãn dưới 15 MB.")
  const bitmap = await createImageBitmap(file).catch(() => { throw new Error("Không mở được ảnh. Hãy chọn lại ảnh PNG hoặc JPG.") })
  try {
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) throw new Error("Chưa đọc được ảnh trên trình duyệt này. Thử nhập mã trên nhãn.")
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return readQrPixels(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height)
  } finally { bitmap.close() }
}
