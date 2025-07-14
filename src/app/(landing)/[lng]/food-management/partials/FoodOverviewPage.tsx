"use client"

import { deleteFoodById, getAllFoods } from "@/app/api/foods"
import { CustomTable } from "@/components/Shared/Table/CustomTable"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import dayjs from "dayjs"
import { MoreVertical } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import AddFoodPopUp from "./AddFoodPopUp"
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
  recipesCount: number
  attributes: FoodAttributesTypes
}

export default function FoodOverviewPage(): React.ReactElement {
  const { data: session } = useSession()
  const token = session?.apiToken

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [openAddFoodPopUp, setOpenAddFoodPopUp] = useState(false)
  const [foods, setFoods] = useState<FoodOverviewDataType[]>([])
  const [searchText, setSearchText] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce searchText for real-time search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText)
    }, 300) // 300ms debounce

    return () => {
      clearTimeout(handler)
    }
  }, [searchText])

  const [category, setCategory] = useState("")
  const [nutritional, setNutritional] = useState("")
  const [season, setSeason] = useState("")
  const [viewFood, setViewFood] = useState(false)
  const [foodId, setFoodId] = useState(0)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [foodIdToDelete, setFoodIdToDelete] = useState<number | null>(null)

  // Function to fetch all foods from API
  const getFoods = async (): Promise<void> => {
    if (!token) return
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
    void getFoods()
  }, [token])

  // Handler to open the "Add Food" popup
  const handleOpenAddFoodPopUp = (): void => {
    setOpenAddFoodPopUp(true)
  }
  // Handler to close the "Add Food" popup
  const handleCloseAddFoodPopUp = (): void => {
    setOpenAddFoodPopUp(false)
  }
  // Handler to close the "View Food" popup
  const handleCloseViewFoodPopUp = (): void => {
    setViewFood(false)
  }
  // Handler to open the "View Food" popup with the selected food ID
  const handleViewFoodOverview = (foodId: number): void => {
    setViewFood(true)
    setFoodId(foodId)
  }

  // Handler to update the selected category filter
  const handleCategoryChange = (value: string): void => {
    setCategory(value)
  }
  // Handler to update the selected nutritional filter
  const handleNutritionalChange = (value: string): void => {
    setNutritional(value)
  }

  // Handler to clear all search and filter values
  const handleClearSearchValues = (): void => {
    setSearchText("")
    setCategory("")
    setNutritional("")
    setSeason("")
    setSelectedMonths([])
  }

  // Static categories for filtering foods
  const categories: dataListTypes[] = [
    { value: "Fruits", label: "Fruit" },
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
        .includes(debouncedSearch.toLowerCase())
      const categoryMatch = category ? food.category === category : true
      const seasonMatch = selectedMonths.length
        ? selectedMonths.some(month => food.season === month)
        : true

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
  }, [foods, debouncedSearch, category, nutritional, season, selectedMonths])

  const totalItems = filteredFoods.length

  // Paginating the filtered foods
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredFoods.slice(startIndex, endIndex)
  }, [filteredFoods, page, pageSize])

  // Columns for the food management table
  const columns: Array<Column<FoodOverviewDataType>> = [
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
          {Array.isArray(row.healthBenefits) &&
          row.healthBenefits.length > 0 ? (
            row.healthBenefits.map((benefit, index) => (
              <Badge key={index} variant={"outline"}>
                {typeof benefit === "string"
                  ? benefit
                  : benefit?.healthBenefit || benefit?.healthBenefitFR || "N/A"}
              </Badge>
            ))
          ) : (
            <Badge variant={"outline"}>No benefits listed</Badge>
          )}
        </div>
      )
    },
    {
      accessor: "seasons",
      header: "Month",
      cell: row => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(row.seasons) && row.seasons.length > 0 ? (
            row.seasons.map((seasonObj, idx) => (
              <Badge key={idx} variant="outline">
                {seasonObj.season || seasonObj.season}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">No season</Badge>
          )}
        </div>
      )
    },
    {
      accessor: "recipesCount",
      header: "Recipes",
      cell: row => (
        <Label className="text-gray-500">{row.recipesCount} Available</Label>
      )
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
              : row.status === "Incomplete"
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
            <DropdownMenuItem
              onClick={() => {
                handleViewFoodOverview(row.id)
              }}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                handleAskDeleteFood(row.id)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  // Show confirmation dialog instead of window.confirm
  const handleAskDeleteFood = (id: number) => {
    setFoodIdToDelete(id)
    setConfirmDeleteOpen(true)
  }

  // Actually delete after confirmation
  const handleDeleteFood = async () => {
    if (!token || !foodIdToDelete) return
    const response = await deleteFoodById(token, foodIdToDelete)
    if (!response.error) {
      await getFoods()
    } else {
      alert(response.message || "Failed to delete food.")
    }
    setConfirmDeleteOpen(false)
    setFoodIdToDelete(null)
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap w-[80%] gap-2">
          <Input
            className="max-w-xs"
            placeholder="Search by food name..."
            value={searchText}
            onChange={e => {
              setSearchText(e.target.value)
            }}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`overflow-x-auto overflow-y-hidden justify-between w-40  ${
                  selectedMonths.length === 0
                    ? "text-gray-500 font-normal hover:text-gray-500"
                    : ""
                }`}
                style={{ scrollbarWidth: "none" }}
              >
                {selectedMonths.length > 0
                  ? selectedMonths.join(", ")
                  : "Select Months"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-40 overflow-auto max-h-64"
              style={{ scrollbarWidth: "none" }}
            >
              <DropdownMenuItem
                disabled
                className="text-xs text-muted-foreground"
              >
                Filter by Months
              </DropdownMenuItem>
              {months.map(month => (
                <DropdownMenuItem
                  key={month.value}
                  onClick={() => {
                    if (selectedMonths.includes(month.value)) {
                      setSelectedMonths(
                        selectedMonths.filter(m => m !== month.value)
                      )
                    } else {
                      setSelectedMonths([...selectedMonths, month.value])
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(month.value)}
                    readOnly
                    className="mr-2"
                  />
                  {month.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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

          {/* Clear Filters Button */}
          {(Boolean(searchText) ||
            Boolean(category) ||
            Boolean(nutritional) ||
            Boolean(season) ||
            selectedMonths.length > 0) && (
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
      <AddFoodPopUp
        open={openAddFoodPopUp}
        onClose={handleCloseAddFoodPopUp}
        getFoods={getFoods} // <-- pass the fetch function
      />

      {/* View Food Details Popup */}
      <ViewFoodPopUp
        open={viewFood}
        onClose={handleCloseViewFoodPopUp}
        token={token}
        foodId={foodId}
        getFoods={getFoods}
      />

      {/* Delete confirmation popup */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this food?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFood}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

