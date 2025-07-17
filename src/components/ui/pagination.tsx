// components/custom-pagination.tsx
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown
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
  const currentSizeIndex = pageSizeOptions.indexOf(pageSize)

  return (
    <div className="w-full flex justify-end py-2 space-x-4 sm:space-x-6 items-center text-xs sm:text-sm text-black">
      {/* Rows Per Page */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <span>Rows per page</span>
        <div className="relative inline-flex items-center border rounded px-2 py-1">
          <span className="mr-3 sm:mr-4">{pageSize}</span>
          <div className="flex flex-col">
            <ChevronUp
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer"
              onClick={() => {
                if (currentSizeIndex < pageSizeOptions.length - 1) {
                  onPageSizeChange(pageSizeOptions[currentSizeIndex + 1])
                  onPageChange(1)
                }
              }}
            />
            <ChevronDown
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer"
              onClick={() => {
                if (currentSizeIndex > 0) {
                  onPageSizeChange(pageSizeOptions[currentSizeIndex - 1])
                  onPageChange(1)
                }
              }}
            />
          </div>
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
