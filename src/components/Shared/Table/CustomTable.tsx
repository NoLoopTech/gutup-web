import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table"
import { CustomPagination } from "@/components/ui/pagination"
import { useRef } from "react"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface CustomTableProps<T> {
  columns: Array<Column<T>>
  data: T[]
  page: number
  pageSize: number
  totalItems: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRowClick?: (row: T, rowIndex: number) => void
  activeRowId?: number | null
  setActiveRowId?: (id: number | null) => void
  renderRowDropdown?: (row: T) => React.ReactNode
}

export function CustomTable<T extends Record<string, any>>({
  columns,
  data,
  page,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  activeRowId,
  setActiveRowId,
  renderRowDropdown,
  onRowClick
}: CustomTableProps<T> & {
  activeRowId?: number | null
  setActiveRowId?: (id: number | null) => void
  renderRowDropdown?: (row: T) => React.ReactNode
  onRowClick?: (row: T, rowIndex: number) => void
}): JSX.Element {
  const tableRef = useRef<HTMLTableSectionElement>(null)

  return (
    <div className="w-full space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody ref={tableRef}>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => {
              const rowId = row.tagId ?? row.dailyTipsId ?? row.id ?? rowIndex
              return (
                <TableRow
                  key={rowId}
                  className={`group cursor-pointer hover:bg-muted relative transition-colors`}
                  onClick={e => {
                    const target = e.target as HTMLElement
                    // Prevent row click action when clicking on the dropdown trigger or popup
                    if (
                      target.closest(".row-action-trigger") ||
                      target.closest(".row-action-popup")
                    ) {
                      return
                    }
                    // Trigger row click to open ViewTagPopUp
                    if (onRowClick) {
                      onRowClick(row, rowIndex)
                    }
                  }}
                  tabIndex={0}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`py-4 ${col.className ?? ""}`}
                    >
                      {col.cell
                        ? col.cell(row)
                        : typeof col.accessor === "function"
                        ? col.accessor(row)
                        : col.accessor
                        ? row[col.accessor]
                        : null}
                    </TableCell>
                  ))}
                  {/* Render the 3-dots icon for dropdown */}
                  <td className="py-4 px-2 align-middle">
                    <div
                      className="row-action-trigger inline-block"
                      onClick={e => {
                        // Stop propagation to prevent row click
                        e.stopPropagation()
                        // Toggle dropdown
                        if (setActiveRowId) {
                          setActiveRowId(activeRowId === rowId ? null : rowId)
                        }
                      }}
                    >
                      {renderRowDropdown?.(row)}
                    </div>
                  </td>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
      <CustomPagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
