// components/custom-pagination.tsx
import React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomPaginationProps {
  page: number
  pageSize: number
  totalItems: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export const CustomPagination = ({
  page,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange
}: CustomPaginationProps): JSX.Element => {
  const totalPages = Math.ceil(totalItems / pageSize)
  const [showDropup, setShowDropup] = React.useState(false)
  const dropupRef = React.useRef<HTMLDivElement>(null)

  // Close dropup when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        dropupRef.current &&
        !dropupRef.current.contains(event.target as Node)
      ) {
        setShowDropup(false)
      }
    }
    if (showDropup) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropup])

  return (
    <div className="w-full flex justify-end py-2 space-x-4 sm:space-x-4 items-center text-xs sm:text-sm text-black">
      {/* Rows Per Page */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <span>Rows per page</span>
        <div className="relative inline-flex items-center" ref={dropupRef}>
          <button
            className="border rounded flex items-center justify-center focus:outline-none bg-white h-5 w-5 sm:h-8 sm:w-8"
            onClick={() => {
              setShowDropup(prev => !prev)
            }}
            type="button"
          >
            <span className="text-center w-full">{pageSize}</span>
          </button>
          {showDropup && (
            <div className="absolute bottom-full mb-1 left-0 z-10 bg-white border rounded shadow-md min-w-full">
              {pageSizeOptions.map(size => (
                <button
                  key={size}
                  className={`w-full text-left px-1 py-1 hover:bg-gray-100 ${
                    size === pageSize ? "bg-gray-200 " : ""
                  }`}
                  onClick={() => {
                    setShowDropup(false)
                    onPageSizeChange(size)
                    onPageChange(1)
                  }}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Page X of Y */}
      <span>
        Page {page} of {totalPages || 1}
      </span>

      {/* Controls */}
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            onPageChange(1)
          }}
          disabled={page <= 1}
          className="border border-Primary-200 mr-1 h-5 w-5 sm:h-8 sm:w-8"
        >
          <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            onPageChange(page - 1)
          }}
          disabled={page <= 1}
          className="border border-Primary-200 mr-1 h-5 w-5 sm:h-8 sm:w-8"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            onPageChange(page + 1)
          }}
          disabled={page >= totalPages}
          className="border border-Primary-200 mr-1 h-5 w-5 sm:h-8 sm:w-8"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            onPageChange(totalPages)
          }}
          disabled={page >= totalPages}
          className="border border-Primary-200 h-5 w-5 sm:h-8 sm:w-8"
        >
          <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  )
}
