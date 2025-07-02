"use client"

import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Type } from "lucide-react"
import { useState, useEffect } from "react"
import { getAllTags } from "@/app/api/foods"
import { deleteTagById } from "@/app/api/foods"
import { Badge } from "@/components/ui/badge"
import AddNewTagPopUp from "../../partials/AddNewTagPopUp"
import { Label } from "@/components/ui/label"
import { useGetAllTags } from "@/query/hooks/useGetAllTags"
import { useDeleteTag } from "@/query/hooks/useDeleteTags"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface TypesOfFoodsDataType {
  tagId: number
  category: string
  count: string
  status: boolean
}

export default function TypesOfFoodsPage({
  token
}: {
  token: string
}): JSX.Element {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [foodTypes, setFoodTypes] = useState<TypesOfFoodsDataType[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [openAddNewTagPopUp, setOpenAddNewTagPopUp] = useState<boolean>(false)
  const { tags, loading, error, fetchTags } =
    useGetAllTags<TypesOfFoodsDataType>(token, "Type")
  const {
    deleteTag,
    loading: deleteLoading,
    error: deleteError
  } = useDeleteTag(token)
  const [tagId, setTagId] = useState<number>(0)

  // handle delete tag OverView
  const handleDeleteTag = (tagId: number): void => {
    setTagId(tagId)
    setConfirmDeleteOpen(true)
  }

  // handle delete tag by id
  const handleDeleteTagById = async (): Promise<void> => {
    if (!tagId) {
      toast.error("Tag ID is invalid.")
      return
    }
    const result = await deleteTag(tagId)
    if (result.success) {
      toast.success(result.message)
      setConfirmDeleteOpen(false)
      fetchTags() // Refresh the data
    } else {
      toast.error("Failed to delete tag", {
        description: result.message
      })
      setConfirmDeleteOpen(false)
    }
  }

  // handle open delete confirmation popup
  const handleOpenDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(true)
  }

  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
  }

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
      setFoodTypes(tags)
    }
  }, [tags])

  const columns: Array<Column<TypesOfFoodsDataType>> = [
    {
      accessor: "category",
      header: "Tag",
      className: "w-40 capitalize",
      cell: (row: TypesOfFoodsDataType) => (
        <Badge variant={"outline"}>{row.category}</Badge>
      )
    },
    {
      accessor: "count",
      header: "Active On",
      cell: (row: TypesOfFoodsDataType) => <Label>{row.count} Items</Label>
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: (row: TypesOfFoodsDataType) => (
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
            <DropdownMenuItem
              onClick={() => {
                handleDeleteTag(row.tagId)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const data = foodTypes
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
        token={token}
        getTags={fetchTags}
        category="Type"
      />
      {/* delete confirmation popup  */}
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={handleCloseDeleteConfirmationPopup}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmationPopup}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTagById}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
