"use client"

import { useRef, useState } from "react"
import { UploadCloud, X } from "lucide-react"

interface ImageUploaderProps {
  title: string
}

export default function ImageUploader({ title }: ImageUploaderProps): JSX.Element {
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
    }
  }

  const handleRemoveImage = (): void => {
    setPreviewUrl(null)
    if (inputRef.current) {
      inputRef.current.value = "" // clear input
    }
  }

  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="text-sm text-black mb-1">{title}</h3>

      {/* Upload Area */}
      {previewUrl ? (
        <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="cursor-pointer border border-gray-300 bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-200 transition duration-200 w-full h-48"
        >
          <UploadCloud size={40} className="text-Primary-500 mb-2" />
          <p className="text-sm mb-1 font-medium text-gray-700">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
