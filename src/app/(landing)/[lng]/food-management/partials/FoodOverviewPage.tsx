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
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import AddFoodPopUp from "./AddFoodPopUp"
import { getAllFoods } from "@/app/api/foods"
import dayjs from "dayjs"
import ViewFoodPopUp from "./ViewFoodPopUp"

interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface dataListTypes {
  value: string
  label: string
}

interface FoodAttributesTypes {
  fiber: number
  proteins: number
  vitamins: string
  minerals: string
  fat: number
  sugar: number
}

interface FoodOverviewDataType {
  id: number
  name: string
  category: string
  healthBenefits: string[]
  season: string
  image: string
  status: string
  createdAt: string
  attributes: FoodAttributesTypes
}

type Season = "Spring" | "Summer" | "Autumn" | "Winter"

// Helper Function for Season Mapping based on month
const getSeasonByMonth = (month: string): Season => {
  const seasonsMonths: { [key in Season]: string[] } = {
    Spring: ["March", "April", "May"],
    Summer: ["June", "July", "August"],
    Autumn: ["September", "October", "November"],
    Winter: ["December", "January", "February"]
  }

  // Loop through each season and check if the month belongs to that season
  for (const season in seasonsMonths) {
    if (seasonsMonths[season as Season].includes(month)) {
      return season as Season // Return the corresponding season
    }
  }
  return "Spring"
}

export default function FoodOverviewPage({ token }: { token: string }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [openAddFoodPopUp, setOpenAddFoodPopUp] = useState(false)
  const [foods, setFoods] = useState<FoodOverviewDataType[]>([])
  const [searchText, setSearchText] = useState("")
  const [category, setCategory] = useState("")
  const [nutritional, setNutritional] = useState("")
  const [season, setSeason] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [viewFood, setViewFood] = useState(false)
  const [foodId, setFoodId] = useState(0)

  // Function to fetch all foods from API
  const getFoods = async () => {
    try {
      const response = await getAllFoods(token)
      if (response.status === 200) {
        setFoods(response.data.foods)
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Failed to fetch foods:", error)
    }
  }

  useEffect(() => {
    getFoods()
  }, [token])

  // Handler to open the "Add Food" popup
  const handleOpenAddFoodPopUp = () => setOpenAddFoodPopUp(true)
  // Handler to close the "Add Food" popup
  const handleCloseAddFoodPopUp = () => setOpenAddFoodPopUp(false)
  // Handler to close the "View Food" popup
  const handleCloseViewFoodPopUp = () => setViewFood(false)
  // Handler to open the "View Food" popup with the selected food ID
  const handleViewFoodOverview = (foodId: number) => {
    setViewFood(true)
    setFoodId(foodId)
  }

  // Handler to update the selected category filter
  const handleCategoryChange = (value: string) => setCategory(value)
  // Handler to update the selected nutritional filter
  const handleNutritionalChange = (value: string) => setNutritional(value)
  // Handler to update the selected month and derive the season
  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    setSeason(getSeasonByMonth(value))
  }

  // Handler to clear all search and filter values
  const handleClearSearchValues = () => {
    setSearchText("")
    setCategory("")
    setNutritional("")
    setSeason("")
    setSelectedMonth("")
  }

  // Static categories for filtering foods
  const categories: dataListTypes[] = [
    { value: "Fruit", label: "Fruit" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Meat", label: "Meat" },
    { value: "Dairy", label: "Dairy" }
  ]

  // Static nutritional options for filtering foods
  const nutritionals: dataListTypes[] = [
    { value: "fiber", label: "Fiber" },
    { value: "proteins", label: "Proteins" },
    { value: "vitamins", label: "Vitamins" },
    { value: "minerals", label: "Minerals" },
    { value: "fat", label: "Fat" },
    { value: "sugar", label: "Sugar" }
  ]

  // Static months for filtering foods by month
  const months: dataListTypes[] = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" }
  ]

  // Filtering logic for foods based on user input
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const nameMatch = food.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const categoryMatch = category ? food.category === category : true
      const seasonMatch = season ? food.season === season : true

      let nutritionalMatch = true
      if (nutritional) {
        // Check the selected nutritional value and apply filter logic
        if (nutritional === "fiber" && food.attributes.fiber <= 0)
          nutritionalMatch = false
        if (nutritional === "proteins" && food.attributes.proteins <= 0)
          nutritionalMatch = false
        if (nutritional === "vitamins" && !food.attributes.vitamins)
          nutritionalMatch = false
        if (nutritional === "minerals" && !food.attributes.minerals)
          nutritionalMatch = false
        if (nutritional === "fat" && food.attributes.fat <= 0)
          nutritionalMatch = false
        if (nutritional === "sugar" && food.attributes.sugar <= 0)
          nutritionalMatch = false
      }

      return nameMatch && categoryMatch && nutritionalMatch && seasonMatch
    })
  }, [foods, searchText, category, nutritional, season])

  const totalItems = filteredFoods.length

  // Paginating the filtered foods
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredFoods.slice(startIndex, endIndex)
  }, [filteredFoods, page, pageSize])

  // Columns for the food management table
  const columns: Column<FoodOverviewDataType>[] = [
    {
      accessor: "image",
      header: "Media",
      cell: row => (
        <Image
          src={row.image}
          alt={row.name}
          width={40}
          height={40}
          className="rounded"
        />
      )
    },
    {
      accessor: "name",
      header: "Name"
    },
    {
      accessor: "category",
      header: "Category",
      className: "w-40",
      cell: row => <Badge variant={"outline"}>{row.category}</Badge>
    },
    {
      accessor: "healthBenefits",
      header: "Health Benefits",
      cell: row => (
        <div className="flex flex-wrap gap-2">
          {row.healthBenefits.map((benefit, index) => (
            <Badge key={index} variant={"outline"}>
              {benefit}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessor: "season",
      header: "Season",
      cell: row => <Badge variant={"outline"}>{row.season}</Badge>
    },
    {
      accessor: "category",
      header: "Recipes"
    },
    {
      accessor: "createdAt",
      header: "Date Added",
      cell: row => dayjs(row.createdAt).format("DD/MM/YYYY")
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: row => (
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
      cell: row => (
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
            <DropdownMenuItem onClick={() => handleViewFoodOverview(row.id)}>
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap w-[80%] gap-2">
          <Input
            className="max-w-xs"
            placeholder="Search by food name..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />

          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {categories.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={nutritional} onValueChange={handleNutritionalChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Nutritional" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {nutritionals.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {months.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {(Boolean(searchText) ||
            Boolean(category) ||
            Boolean(nutritional) ||
            Boolean(season)) && (
            <Button variant="outline" onClick={handleClearSearchValues}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Add New Food Button */}
        <Button onClick={handleOpenAddFoodPopUp}>Add New</Button>
      </div>

      {/* Food Table */}
      <CustomTable
        columns={columns}
        data={paginatedData}
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        pageSizeOptions={[5, 10, 20]}
        onPageChange={setPage}
        onPageSizeChange={size => {
          setPageSize(size)
          setPage(1)
        }}
      />

      {/* Add Food Popup */}
      <AddFoodPopUp open={openAddFoodPopUp} onClose={handleCloseAddFoodPopUp} />

      {/* View Food Details Popup */}
      <ViewFoodPopUp
        open={viewFood}
        onClose={handleCloseViewFoodPopUp}
        token={token}
        foodId={foodId}
      />
    </div>
  )
}
