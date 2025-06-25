"use client"

import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import AddNewTagPopUp from "../../partials/AddNewTagPopUp"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface TypesOfFoodsDataType {
  tag: string
  activeOn: string
  createdOn: string
  status: string
}

export default function TypesOfFoodsPage(): React.ReactElement {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [openAddNewTagPopUp, setOpenAddNewTagPopUp] = useState<boolean>(false)

  // handle open add food popup
  const handleOpenAddNewTagPopUp = (): void => {
    setOpenAddNewTagPopUp(true)
  }

  // handle close add food popup
  const handleCloseAddNewTagPopUp = (): void => {
    setOpenAddNewTagPopUp(false)
  }

  const columns: Array<Column<TypesOfFoodsDataType>> = [
    {
      accessor: "tag",
      header: "Tag",
      className: "w-40",
      cell: (row: TypesOfFoodsDataType) => (
        <Badge variant={"outline"}>{row.tag}</Badge>
      )
    },
    {
      accessor: "activeOn",
      header: "Active On"
    },
    {
      accessor: "createdOn",
      header: "Created On"
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: (row: TypesOfFoodsDataType) => (
        <Badge
          className={
            row.status === "Active"
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : row.status === "In Active"
              ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-100 border border-yellow-700"
              : "bg-red-300 text-red-700 hover:bg-red-200 border border-red-700"
          }
        >
          {row.status}
        </Badge>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: TypesOfFoodsDataType) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-6"
              size="icon"
            >
              <MoreVertical className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const data: TypesOfFoodsDataType[] = [
    {
      tag: "Carrot",
      activeOn: "2025-05-16",
      createdOn: "2025-05-16",
      status: "Active"
    },
    {
      tag: "Carrot",
      activeOn: "2025-05-16",
      createdOn: "2025-05-16",
      status: "In Active"
    }
  ]

  const pageSizeOptions = [5, 10, 20]

  const totalItems = data.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = data.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      {/* add new food button */}
      <div className="flex justify-end mb-5 -mt-14">
        <Button onClick={handleOpenAddNewTagPopUp}>Add New</Button>
      </div>
      {/* foods management table */}
      <CustomTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      {/* add food popup */}
      <AddNewTagPopUp
        open={openAddNewTagPopUp}
        onClose={handleCloseAddNewTagPopUp}
      />
    </div>
  )
}
