"use client"

import { useRef, useState, useEffect } from "react"
import { UploadCloud, X } from "lucide-react"

interface ImageUploaderProps {
  title: string
  onChange?: (files: File[] | null) => void
  previewUrls?: string[]
  disabled?: boolean // Add the disabled prop
}

export default function ImageUploader({
  title,
  onChange,
  previewUrls = [],
  disabled = false // Default to false if not provided
}: ImageUploaderProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageList, setImageList] = useState<string[]>([])

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
      const newFiles = Array.from(files)
      const newImageList = [...imageList]

      // Convert files to data URLs and update the state
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImageList.push(reader.result as string) // Add the new image to the list
          setImageList(newImageList) // Update the image list in state
        }
        reader.readAsDataURL(file)
      })

      onChange?.(newFiles) // Pass the new files back to parent component (if needed)
    }
  }

  // Remove selected image from the list
  const handleRemoveImage = (imageUrl: string): void => {
    const updatedImageList = imageList.filter(image => image !== imageUrl)
    setImageList(updatedImageList) // Update the state with the new list
    onChange?.(updatedImageList) // Pass the updated list of images back to parent component (if needed)
  }

  return (
    <div className="">
      {/* Title */}
      <h3 className="mb-1 text-sm text-black">{title}</h3>

      {/* Upload Area */}
      {imageList.length > 0 ? (
        <div className="">
          {/* Loop through all preview images and display them */}
          {imageList.map((image, index) => (
            <div
              key={index}
              className="relative w-[100%] flex items-center justify-center h-48 overflow-hidden border border-gray-300 rounded-lg bg-gray-50"
            >
              <img
                src={image}
                alt={`Uploaded preview ${index}`}
                className="object-contain max-w-full max-h-full"
              />
              {/* Remove button */}
              {!disabled && (
                <button
                  onClick={() => handleRemoveImage(image)}
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
            disabled={disabled} // Disable the input if the disabled prop is true
          />
        </div>
      )}
    </div>
  )
}
