"use client"

import { CustomTable } from "@/components/Shared/Table/CustomTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import sampleImage from "@/../../public/images/sample-image.png"
import AddRecipePopup from "./AddRecipePopUp"
import { getAllRecipes } from "@/app/api/recipe"
import { Label } from "@/components/ui/label"
import dayjs from "dayjs"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface RecipeDataType {
  id: number
  name: string
  category: string
  createdAt: string
  isActive: boolean
  images: string[]
  healthBenefits: string[]
  preparation: string
  rest: string
  persons: number
  ingredients: string[]
}

interface dataListTypes {
  value: string
  label: string
}

export default function RecipeManagementPage({
  token
}: {
  token: string
}): JSX.Element {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [openAddRecipePopUp, setOpenAddRecipePopUp] = useState(false)
  const [recipes, seRecipes] = useState<RecipeDataType[]>([])

  // handle get users
  const getRecipes = async (): Promise<void> => {
    try {
      const response = await getAllRecipes(token)
      if (response.status === 200) {
        seRecipes(response.data)
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  useEffect(() => {
    void getRecipes()
  }, [])

  // handle open add food popup
  const handleOpenAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(true)
  }

  // handle close add food popup
  const handleCloseAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(false)
  }

  const columns: Array<Column<RecipeDataType>> = [
    {
      accessor: "images",
      header: "Media",
      cell: (row: RecipeDataType) => (
        <Image
          src={sampleImage}
          alt={row.name}
          width={40}
          height={40}
          className="rounded"
        />
      )
    },
    {
      accessor: "name",
      header: "Recipe Name"
    },
    {
      accessor: "category",
      header: "Category",
      className: "w-40",
      cell: (row: RecipeDataType) => (
        <Badge variant={"outline"}>{row.category}</Badge>
      )
    },
    {
      accessor: "persons",
      header: "Servings",
      className: "w-28",
      cell: (row: RecipeDataType) => <Label>{row.persons} Servings</Label>
    },
    {
      accessor: "ingredients",
      header: "Main Ingredients"
    },
    {
      accessor: "healthBenefits",
      header: "Health Benefits",
      cell: (row: RecipeDataType) => (
        <div className="flex flex-wrap gap-2">
          {row.healthBenefits.map((benefit, idx) => (
            <Badge key={`${benefit}-${idx}`} variant={"outline"}>
              {benefit}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessor: "createdAt",
      header: "Date Added",
      cell: (row: any) => dayjs(row.createdAt).format("DD/MM/YYYY")
    },
    {
      accessor: "isActive",
      header: "Status",
      className: "w-28",
      cell: (row: RecipeDataType) => (
        <Badge
          className={
            row.isActive
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : "bg-red-300 text-red-700 hover:bg-red-200 border border-red-700"
          }
        >
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: RecipeDataType) => (
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

  const pageSizeOptions = [5, 10, 20]

  const totalItems = recipes.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = recipes.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  const categories: dataListTypes[] = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Snack", label: "Snack" }
  ]

  const servings: dataListTypes[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" }
  ]

  const healthBenefits: dataListTypes[] = [
    { value: "Immune Support", label: "Immune Support" },
    { value: "Skin Health", label: "Skin Health" },
    { value: "Eye Health", label: "Eye Health" }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap w-[80%] gap-2">
          {/* search recipes by name */}
          <Input className="max-w-xs" placeholder="Search by recipe..." />

          {/* select category */}
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {categories.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* select Servings */}
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Servings" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {servings.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* select Health Benefits */}
          <Select>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Health Benefits" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {healthBenefits.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* add new food button */}
        <Button onClick={handleOpenAddRecipePopUp}>Add New</Button>
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
      <AddRecipePopup
        open={openAddRecipePopUp}
        onClose={handleCloseAddRecipePopUp}
      />
    </div>
  )
}
