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
import { MoreVertical, ThumbsDown, ThumbsUp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import sampleImage from "@/../../public/images/sample-image.png"
import AddDailyTipMainPopUp from "./AddDailyTipMainPopUp.tsx"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface DailyTipsDataType {
  media: string
  title: string
  content: string
  dateCreated: string
  datePublished: string
  status: string
  likes: number
  dislikes: number
}

export default function DailyTipsPage() {
  const [isOpenAddTip, setIsOpenAddTip] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const handleOpenAddTip = () => {
    setIsOpenAddTip(true)
  }
  const handleCloseAddTip = () => {
    setIsOpenAddTip(false)
  }

  const columns: Column<DailyTipsDataType>[] = [
    {
      accessor: "media",
      header: "Media",
      cell: (row: DailyTipsDataType) => (
        <Image
          src={sampleImage}
          alt={row.title}
          width={40}
          height={40}
          className="rounded"
        />
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
      cell: (row: DailyTipsDataType) => (
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
      id: "engagement",
      header: "Engagement",
      className: "w-40",
      cell: (row: DailyTipsDataType) => (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-green-600">
            <span>{row.likes}</span>
            <ThumbsUp size={16} />
          </div>
          <div className="flex items-center gap-1 text-red-600">
            <span>{row.dislikes}</span>
            <ThumbsDown size={16} />
          </div>
        </div>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: DailyTipsDataType) => (
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

  const data: DailyTipsDataType[] = [
    {
      media: "/images/carrot.jpg", // public/images/carrot.jpg
      title: "Stay Hydrated",
      content: "Main content of the tip",
      dateCreated: "2025-05-16",
      datePublished: "2025-05-16",
      status: "Active",
      likes: 178,
      dislikes: 32
    },
    {
      media: "/images/carrot.jpg",
      title: "Stay Cool",
      content: "Another tip",
      dateCreated: "2025-05-16",
      datePublished: "2025-05-16",
      status: "Pending",
      likes: 178,
      dislikes: 32
    }
  ]

  const pageSizeOptions: number[] = [5, 10, 20]

  const totalItems: number = data.length
  const startIndex: number = (page - 1) * pageSize
  const endIndex: number = startIndex + pageSize
  const paginatedData: DailyTipsDataType[] = data.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  return (
    <div className="space-y-4 ">
      <div className="flex justify-end mb-5 -mt-14">
        <Button onClick={handleOpenAddTip}>Add New</Button>
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

      <AddDailyTipMainPopUp open={isOpenAddTip} onClose={handleCloseAddTip} />
    </div>
  )
}
