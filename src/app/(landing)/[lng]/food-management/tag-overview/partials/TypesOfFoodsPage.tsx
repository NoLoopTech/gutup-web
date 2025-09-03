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
import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import AddNewTagPopUp from "../../partials/AddNewTagPopUp"
import ViewTagPopUp from "../../partials/ViewTagPopUp"
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
  const { tags, fetchTags } = useGetAllTags<TypesOfFoodsDataType>(token, "Type")
  const { deleteTag } = useDeleteTag(token)
  const [tagId, setTagId] = useState<number | null>(null)
  const [activeRowId, setActiveRowId] = useState<number | null>(null)
  const [viewTagPopUpOpen, setViewTagPopUpOpen] = useState<boolean>(false)
  const [selectedTagData, setSelectedTagData] = useState<any>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  // Handle row click to view tag details
  const handleRowClick = (row: any): void => {
    setSelectedTagData({
      category: row.category,
      tagNameFr: row.tagNameFr
    })
    setViewTagPopUpOpen(true)
  }

  // handle delete tag OverView
  const handleDeleteTag = (tagId: number): void => {
    setTagId(tagId)
    setConfirmDeleteOpen(true)
  }

  // handle delete tag click from dropdown
  const handleDeleteTagClick = (row: TypesOfFoodsDataType): void => {
    const id =
      row.tagId || (row as any).id || (row as any)._id || (row as any).tag_id

    if (id) {
      handleDeleteTag(id)
    } else {
      console.error("No valid ID found in row data")
      toast.error("Unable to find tag ID")
    }
  }

  // handle delete tag by id
  const handleDeleteTagById = async (): Promise<void> => {
    if (!tagId || tagId <= 0) {
      toast.error("Tag ID is invalid or missing.")
      console.error("Invalid tagId:", tagId)
      setConfirmDeleteOpen(false)
      return
    }
    const result = await deleteTag(tagId)
    if (result.success) {
      toast.success(result.message)
      setConfirmDeleteOpen(false)
      await fetchTags()
    } else {
      toast.error("Failed to delete tag", {
        description: result.message
      })
      setConfirmDeleteOpen(false)
    }
  }

  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
    setTagId(null)
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

  useEffect(() => {
    if (activeRowId === null) return
    function handleClickOutside(event: MouseEvent): void {
      const target = event.target as HTMLElement
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(target) &&
        !target.closest(".row-action-trigger") &&
        !target.closest(".row-action-popup")
      ) {
        setActiveRowId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeRowId])

  const columns: any[] = [
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
      cell: (row: TypesOfFoodsDataType) => null
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

  // Render row dropdown for table actions
  const renderRowDropdown = (row: TypesOfFoodsDataType): JSX.Element => (
    <div className="row-action-popup">
      <DropdownMenu
        open={activeRowId === row.tagId}
        onOpenChange={open => {
          setActiveRowId(open ? row.tagId : null)
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="row-action-trigger data-[state=open]:bg-muted text-muted-foreground flex size-6"
            size="icon"
            tabIndex={-1}
          >
            <MoreVertical className="w-5 h-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              handleDeleteTagClick(row)
              setActiveRowId(null)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

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
        activeRowId={activeRowId}
        setActiveRowId={setActiveRowId}
        renderRowDropdown={renderRowDropdown}
        onRowClick={handleRowClick}
      />
      {/* view tag popup */}
      {selectedTagData && (
        <ViewTagPopUp
          open={viewTagPopUpOpen}
          onClose={() => {
            setViewTagPopUpOpen(false)
          }}
          tagData={selectedTagData}
        />
      )}
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
