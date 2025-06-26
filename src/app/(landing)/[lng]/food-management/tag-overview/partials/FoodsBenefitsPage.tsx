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
import { useState, useEffect } from "react"
import { getAllTags } from "@/app/api/foods"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import AddNewTagPopUp from "../../partials/AddNewTagPopUp"
import { useGetAllTags } from "@/query/hooks/useGetAllTags"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface FoodsBenefitsDataType {
  // tag: string
  category: string
  count: string
  // activeOn: string
  // createdOn: string
  status: boolean
}

export default function FoodsBenefitsPage({
  token
}: {
  token: string
}): JSX.Element {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [foodBenefits, setFoodBenefits] = useState<FoodsBenefitsDataType[]>([])
  const [openAddNewTagPopUp, setOpenAddNewTagPopUp] = useState<boolean>(false)
  const { tags, loading, error } = useGetAllTags<FoodsBenefitsDataType>(token)

  // handle open add food popup
  const handleOpenAddNewTagPopUp = (): void => {
    setOpenAddNewTagPopUp(true)
  }

  // handle close add food popup
  const handleCloseAddNewTagPopUp = (): void => {
    setOpenAddNewTagPopUp(false)
  }

  useEffect(() => {
    if (tags) {
      setFoodBenefits(tags)
    }
    console.log("Tags updated2:", tags)
  }, [tags])

  const columns: Array<Column<FoodsBenefitsDataType>> = [
    {
      accessor: "category",
      header: "Tag",
      className: "w-40 capitalize" ,
      cell: (row: FoodsBenefitsDataType): React.ReactNode => (
        <Badge variant={"outline"}>{row.category}</Badge>
      )
    },
    {
      accessor: "count",
      header: "Active On",
      cell: (row: FoodsBenefitsDataType) => <Label>{row.count} Items</Label>
    },
    // {
    //   accessor: "createdOn",
    //   header: "Created On"
    // },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: (row: FoodsBenefitsDataType): React.ReactNode => (
        <Badge
          className={
            row.status
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : "bg-red-300 text-red-700 hover:bg-red-200 border border-red-700"
          }
        >
          {row.status ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: FoodsBenefitsDataType): React.ReactNode => (
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

  const data = foodBenefits
  const pageSizeOptions: number[] = [5, 10, 20]
  const totalItems: number = data.length
  const startIndex: number = (page - 1) * pageSize
  const endIndex: number = startIndex + pageSize
  const paginatedData: FoodsBenefitsDataType[] = data.slice(
    startIndex,
    endIndex
  )

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
