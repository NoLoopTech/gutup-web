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
import { useEffect, useState } from "react"
import AddMoodMainPopUp from "./AddMoodMainPopUp"
import { AddNewMood, getAllMoods } from "@/app/api/mood"
import { useMoodStore } from "@/stores/useMoodStore"
import { AddMoodRequestBody } from "@/types/moodsTypes"
import { toast } from "sonner"

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
  status: string
}

export default function MoodsPage({ token }: { token: string }): JSX.Element {
  const [isOpenAddMood, setIsOpenAddMood] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [moods, setMooods] = useState<MoodsDataType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    allowMultiLang,
    activeLang,
    translationsData,
    activeTab,
    resetTranslations
  } = useMoodStore()

  // handle get users
  const getMoods = async (): Promise<void> => {
    try {
      const response = await getAllMoods(token)
      if (response.status === 200) {
        const transformedData: MoodsDataType[] = response.data.map(
          (item: any) => {
            let title = ""
            let content = ""

            switch (item.layout) {
              case "Recipe":
                title = item.recipe?.recipe ?? ""
                content = item.recipe?.description ?? ""
                break
              case "Food":
                title = item.ingredient?.foodName ?? ""
                content = item.ingredient?.description ?? ""
                break
              case "Quote":
                title = item.quote?.quoteAuthor ?? ""
                content = item.quote?.quoteDetail ?? ""
                break
            }

            return {
              mood: item.mood,
              title,
              content,
              dateCreated: new Date(item.createdAt).toLocaleDateString(),
              status: "Active"
            }
          }
        )
        setMooods(transformedData)
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Failed to fetch moods:", error)
    }
  }

  const handleAddMood = async () => {
    const requestBody: AddMoodRequestBody = {
      allowMultiLang,
      activeLang,
      activeTab,
      translationsData
    }
    try {
      setIsLoading(true)
      const response = await AddNewMood(token, requestBody)
      if (response.status === 200 || response.status === 201) {
        toast.success("Mood added successfully")
        setIsOpenAddMood(false)
        getMoods()

        // clear store and session
        resetTranslations()
      } else {
        toast.error("Failed to add mood")
      }
    } catch (error) {
      console.log(error)
    } finally {
      sessionStorage.removeItem("mood-storage")
      setIsLoading(false)
    }
  }

  const handleOpenAddMood = (): void => {
    setIsOpenAddMood(true)
  }
  const handleCloseAddMood = (): void => {
    setIsOpenAddMood(false)
  }

  useEffect(() => {
    void getMoods()
  }, [])

  const columns: Array<Column<MoodsDataType>> = [
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
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const pageSizeOptions = [5, 10, 20]

  const totalItems = moods.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = moods.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end -mt-14 mb-5">
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

      <AddMoodMainPopUp
        open={isOpenAddMood}
        onClose={handleCloseAddMood}
        addMood={handleAddMood}
        isLoading={isLoading}
      />
    </div>
  )
}
