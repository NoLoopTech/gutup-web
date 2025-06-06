"use client"

import { useRef } from "react"
import { UploadCloud } from "lucide-react"

interface ImageUploaderProps {
  title: string
}

export default function ImageUploader({ title }: ImageUploaderProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = (): void => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Selected file:", file)
      // You can preview or upload this file
    }
  }

  return (
    <div className="w-full">
      {/* Title */}
      <h3 className="text-sm text-black mb-1">{title}</h3>

      {/* Upload Area */}
      <div
        onClick={handleClick}
        className="cursor-pointer border border-gray-300 bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-200 transition duration-200 w-full"
      >
        <UploadCloud size={40} className="text-Primary-500 mb-2" />
        <p className="text-sm mb-1 font-medium text-gray-700">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        <input
          type="file"
          accept=".jpg,.jpeg,.svg"
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
