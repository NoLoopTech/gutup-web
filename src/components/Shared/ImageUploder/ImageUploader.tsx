"use client"

import { useRef, useState, useEffect } from "react"
import { UploadCloud, X } from "lucide-react"
import Image from "next/image"

interface ImageUploaderProps {
  title: string | undefined
  onChange?: (files: File[] | null) => void
  previewUrls?: string[]
  disabled?: boolean // Add the disabled prop
  uploadText?: string // Optional custom upload text
  uploadSubText?: string // Optional custom subtext
}

export default function ImageUploader({
  title,
  onChange,
  previewUrls = [],
  disabled = false, // Default to false if not provided
  uploadText = "Click to upload or drag and drop", // Default value
  uploadSubText = "SVG, PNG, JPG or GIF (MAX. 800x400px)" // Default value
}: ImageUploaderProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageList, setImageList] = useState<string[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  // Initialize imageList with previewUrls when component first mounts
  useEffect(() => {
    if (previewUrls.length > 0) {
      setImageList(previewUrls)
    }
  }, [previewUrls])

  // Handle clicking the upload area to trigger file input
  const handleClick = (): void => {
    if (disabled) return // Prevent file selection if disabled
    inputRef.current?.click()
  }

  // Handle when a file is selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }

  // Handle files from input or drop
  const handleFiles = (newFiles: File[]) => {
    const newImageList = [...imageList]
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImageList.push(reader.result as string)
        setImageList([...newImageList])
      }
      reader.readAsDataURL(file)
    })
    onChange?.(newFiles)
  }

  // Remove selected image from the list
  const handleRemoveImage = (imageUrl: string): void => {
    const updatedImageList = imageList.filter(image => image !== imageUrl)
    setImageList(updatedImageList)
    if (updatedImageList.length === 0) {
      onChange?.(null)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  return (
    <div className="">
      {/* Title */}
      <h3 className="mb-1 text-sm text-black">{title}</h3>

      {/* Upload Area */}
      {imageList.length > 0 ? (
        <div className="">
          {/* Loop through all preview images and display them */}
          {Array.isArray(imageList) &&
            imageList.map((image, index) => (
              <div
                key={index}
                className="relative w-[100%] flex items-center justify-center h-48 overflow-hidden border border-gray-300 rounded-lg bg-gray-50"
              >
                <Image
                  src={image}
                  alt={`Uploaded preview ${index}`}
                  width={192}
                  height={192}
                  className="object-contain max-w-full max-h-full"
                />
                {/* Remove button */}
                {!disabled && (
                  <button
                    onClick={() => {
                      handleRemoveImage(image)
                    }}
                    className="absolute p-1 transition bg-white rounded-full shadow top-2 right-2 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-48 p-6 text-center transition duration-200 bg-gray-100 border border-gray-300 rounded-lg  hover:bg-gray-200 ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          } ${isDragActive ? "ring-2 ring-blue-400 bg-blue-50" : ""}`}
        >
          <UploadCloud size={40} className="mb-2 text-Primary-500" />
          <p className="mb-1 text-sm font-medium text-gray-700">{uploadText}</p>
          <p className="text-xs text-gray-400">{uploadSubText}</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.svg"
            className="hidden"
            ref={inputRef}
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  )
}
