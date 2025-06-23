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
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import sampleImage from "@/../../public/images/sample-image.png"
import AddRecipePopup from "./AddRecipePopUp"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface RecipeManagementDataType {
  media: string
  recipeName: string
  category: string
  servings: string
  mainIngredients: string[]
  healthBenefits: string[]
  dateAdded: string
  status: string
}

interface dataListTypes {
  value: string
  label: string
}

export default function RecipeManagementPage(): JSX.Element {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [openAddRecipePopUp, setOpenAddRecipePopUp] = useState(false)

  // handle open add food popup
  const handleOpenAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(true)
  }

  // handle close add food popup
  const handleCloseAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(false)
  }

  const columns: Array<Column<RecipeManagementDataType>> = [
    {
      accessor: "media",
      header: "Media",
      cell: (row: RecipeManagementDataType) => (
        <Image
          src={sampleImage}
          alt={row.recipeName}
          width={40}
          height={40}
          className="rounded"
        />
      )
    },
    {
      accessor: "recipeName",
      header: "Recipe Name"
    },
    {
      accessor: "category",
      header: "Category",
      className: "w-40",
      cell: (row: RecipeManagementDataType) => (
        <Badge variant={"outline"}>{row.category}</Badge>
      )
    },
    {
      accessor: "servings",
      header: "Servings"
    },
    {
      accessor: "mainIngredients",
      header: "Main Ingredients"
    },
    {
      accessor: "healthBenefits",
      header: "Health Benefits",
      cell: (row: RecipeManagementDataType) => (
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
      accessor: "dateAdded",
      header: "Date Added"
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: (row: RecipeManagementDataType) => (
        <Badge
          className={
            row.status === "Active"
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : row.status === "Pending"
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
      cell: (row: RecipeManagementDataType) => (
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

  const data: RecipeManagementDataType[] = [
    {
      media: "/images/carrot.jpg", // public/images/carrot.jpg
      recipeName: "Carrot",
      category: "Vegetable",
      healthBenefits: ["Immune Support", "Skin Health", "Eye Health"],
      mainIngredients: ["Carrot", "Potato", "Onion"],
      servings: "1 Available",
      dateAdded: "2025-05-16",
      status: "Active"
    },
    {
      media: "/images/carrot.jpg",
      recipeName: "Carrot",
      category: "Vegetable",
      healthBenefits: ["Immune Support", "Skin Health", "Eye Health"],
      mainIngredients: ["Carrot", "Potato", "Onion"],
      servings: "1 Available",
      dateAdded: "2025-05-16",
      status: "Incomplete"
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
