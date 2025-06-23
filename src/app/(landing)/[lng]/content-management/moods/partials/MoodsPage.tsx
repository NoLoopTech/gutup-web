"use client"

import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import AddMoodMainPopUp from "./AddMoodMainPopUp"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface MoodsDataType {
  mood: string
  title: string
  content: string
  dateCreated: string
  datePublished: string
  status: string
}

export default function MoodsPage() {
  const [isOpenAddMood, setIsOpenAddMood] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleOpenAddMood = () => {
    setIsOpenAddMood(true)
  }
  const handleCloseAddMood = () => {
    setIsOpenAddMood(false)
  }
  const columns: Column<MoodsDataType>[] = [
    {
      accessor: "mood",
      header: "Mood",
      className: "w-40",
      cell: (row: MoodsDataType) => (
        <Badge variant={"outline"}>{row.mood}</Badge>
      )
    },
    {
      accessor: "title",
      header: "Title"
    },
    {
      accessor: "content",
      header: "Content"
    },
    {
      accessor: "dateCreated",
      header: "Date Created"
    },
    {
      accessor: "datePublished",
      header: "Date Published"
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-40",
      cell: (row: MoodsDataType) => (
        <Badge
          className={
            row.status === "Active"
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : row.status === "Pending"
              ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-100 border border-yellow-700"
              : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-700"
          }
        >
          {row.status}
        </Badge>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: MoodsDataType) => (
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

  const data: MoodsDataType[] = [
    {
      mood: "Very Happy",
      title: "Stay Hydrated",
      content: "Main content of the tip",
      dateCreated: "2025-05-16",
      datePublished: "2025-05-16",
      status: "Active"
    },
    {
      mood: "Very Sad",
      title: "Stay Cool",
      content: "Another tip",
      dateCreated: "2025-05-16",
      datePublished: "2025-05-16",
      status: "Pending"
    }
  ]

  const pageSizeOptions = [5, 10, 20]

  const totalItems = data.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = data.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-5 -mt-14">
        <Button onClick={handleOpenAddMood}>Add New</Button>
      </div>

      {/* user management table */}
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

      <AddMoodMainPopUp open={isOpenAddMood} onClose={handleCloseAddMood} />
    </div>
  )
}
