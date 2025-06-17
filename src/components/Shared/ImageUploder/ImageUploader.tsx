"use client"

import { useRef, useState } from "react"
import { UploadCloud, X } from "lucide-react"

interface ImageUploaderProps {
  title: string
  onChange?: (file: File | null) => void
}

export default function ImageUploader({
  title,
  onChange
}: ImageUploaderProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleClick = (): void => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      onChange?.(file)
    }
  }

  const handleRemoveImage = (): void => {
    setPreviewUrl(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }

    onChange?.(null)
  }

  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="mb-1 text-sm text-black">{title}</h3>

      {/* Upload Area */}
      {previewUrl ? (
        <div className="relative flex items-center justify-center w-full h-48 overflow-hidden border border-gray-300 rounded-lg bg-gray-50">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="max-h-full max-w-full object-contain"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute p-1 transition bg-white rounded-full shadow top-2 right-2 hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="flex flex-col items-center justify-center w-full h-48 p-6 text-center transition duration-200 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
        >
          <UploadCloud size={40} className="mb-2 text-Primary-500" />
          <p className="mb-1 text-sm font-medium text-gray-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.svg"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  )
}
