"use client"

import {
  deleteFoodById,
  getAllFoods,
  getCatagoryFoodType
} from "@/app/api/foods"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
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
  fiber: string
  fiberFR: string
  proteins: string
  proteinsFR: string
  vitamins: string
  vitaminsFR: string
  minerals: string
  mineralsFR: string
  fat: string
  fatFR: string
  sugar: string
  sugarFR: string
}

interface SeasonDto {
  foodId: number
  season: string
  seasonFR: string
}

interface FoodOverviewDataType {
  id: number
  name: string
  category: string
  healthBenefits: string[]
  season?: string
  seasons: SeasonDto[]
  image: string
  status: string
  createdAt: string
  recipeCount: number
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
  const [foodId, setFoodId] = useState<number | null>(null)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [foodIdToDelete, setFoodIdToDelete] = useState<number | null>(null)

  const [categoryOptionsApi, setCategoryOptionsApi] = useState<dataListTypes[]>(
    []
  )

  const [activeRowId, setActiveRowId] = useState<number | null>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      if (!token) return
      const typeResponse = await getCatagoryFoodType(token, "Type")
      if (typeResponse?.status === 200 && Array.isArray(typeResponse.data)) {
        setCategoryOptionsApi(
          typeResponse.data.map((item: any) => ({
            value: item.tagName,
            label: item.tagName
          }))
        )
      }
    }
    void fetchCategories()
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

  // Add: handle row click to open view popup
  const handleRowClick = (row: FoodOverviewDataType): void => {
    handleViewFoodOverview(row.id)
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
        ? food.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        : debouncedSearch === ""
      const categoryMatch = category ? food.category === category : true

      // FIX: Check seasons array for selected months
      const seasonMatch = selectedMonths.length
        ? Array.isArray(food.seasons)
          ? food.seasons.some(
              seasonObj =>
                seasonObj?.season && selectedMonths.includes(seasonObj.season)
            )
          : food.season
          ? selectedMonths.includes(food.season)
          : false
        : true

      let nutritionalMatch = true
      if (nutritional && food.attributes) {
        // Check the selected nutritional value and apply filter logic
        if (
          nutritional === "fiber" &&
          (!food.attributes.fiber || food.attributes.fiber.trim() === "")
        )
          nutritionalMatch = false
        if (
          nutritional === "proteins" &&
          (!food.attributes.proteins || food.attributes.proteins.trim() === "")
        )
          nutritionalMatch = false
        if (
          nutritional === "vitamins" &&
          (!food.attributes.vitamins || food.attributes.vitamins.trim() === "")
        )
          nutritionalMatch = false
        if (
          nutritional === "minerals" &&
          (!food.attributes.minerals || food.attributes.minerals.trim() === "")
        )
          nutritionalMatch = false
        if (
          nutritional === "fat" &&
          (!food.attributes.fat || food.attributes.fat.trim() === "")
        )
          nutritionalMatch = false
        if (
          nutritional === "sugar" &&
          (!food.attributes.sugar || food.attributes.sugar.trim() === "")
        )
          nutritionalMatch = false
      } else if (nutritional && !food.attributes) {
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
      cell: row =>
        row.image ? (
          <Image
            src={row.image}
            alt={row.name || "Food image"}
            width={40}
            height={40}
            className="rounded"
            onError={e => {
              const target = e.target as HTMLImageElement
              // target.src = "/images/placeholder-food.png"
            }}
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )
    },
    {
      accessor: "name",
      header: "Name",
      cell: row => <span>{row.name || "Unnamed Food"}</span>
    },
    {
      accessor: "category",
      header: "Category",
      className: "w-40",
      cell: row => (
        <Badge variant={"outline"}>{row.category || "No Category"}</Badge>
      )
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
                  : typeof benefit === "object" &&
                    benefit !== null &&
                    ("healthBenefit" in benefit || "healthBenefitFR" in benefit)
                  ? (
                      benefit as {
                        healthBenefit?: string
                        healthBenefitFR?: string
                      }
                    ).healthBenefit ??
                    (
                      benefit as {
                        healthBenefit?: string
                        healthBenefitFR?: string
                      }
                    ).healthBenefitFR ??
                    "N/A"
                  : "N/A"}
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
                {seasonObj?.season || "Unknown"}
              </Badge>
            ))
          ) : (
            <Badge variant="outline">No season</Badge>
          )}
        </div>
      )
    },
    {
      accessor: "recipeCount",
      header: "Recipes",
      cell: row => (
        <Label className="text-gray-500">
          {row.recipeCount !== null && row.recipeCount !== undefined
            ? `${row.recipeCount} Available`
            : "0 Available"}
        </Label>
      )
    },
    {
      accessor: "createdAt",
      header: "Date Added",
      cell: row => {
        if (!row.createdAt)
          return <span className="text-gray-500">No date</span>
        const date = dayjs(row.createdAt)
        return date.isValid() ? (
          date.format("DD/MM/YYYY")
        ) : (
          <span className="text-gray-500">Invalid date</span>
        )
      }
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: row => {
        const status = row.status || "Unknown"
        return (
          <Badge
            className={
              status === "Active"
                ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
                : status === "Incomplete"
                ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-100 border border-yellow-700"
                : "bg-red-300 text-red-700 hover:bg-red-200 border border-red-700"
            }
          >
            {status}
          </Badge>
        )
      }
    }
  ]

  // Render row dropdown function (like StoreManagementPage)
  const renderRowDropdown = (row: FoodOverviewDataType): React.ReactNode => (
    <div className="row-action-popup">
      <DropdownMenu>
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
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={e => {
              e.stopPropagation()
              handleAskDeleteFood(row.id)
              setActiveRowId(null)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  // Show confirmation dialog instead of window.confirm
  const handleAskDeleteFood = (id: number): void => {
    setFoodIdToDelete(id)
    setConfirmDeleteOpen(true)
  }

  // Actually delete after confirmation
  const handleDeleteFood = async (): Promise<void> => {
    if (!token || !foodIdToDelete) return

    try {
      const response = await deleteFoodById(token, foodIdToDelete)

      if (response.error) {
        toast.error("Failed to delete food", {
          description: response.data?.message || "An error occurred"
        })
      } else if (response.status === 200 || response.status === 201) {
        toast.success("Food deleted successfully")
        await getFoods()
      } else {
        toast.error("Failed to delete food", {
          description: response.data?.message || "Unknown error"
        })
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete food", {
        description: "An unexpected error occurred"
      })
    } finally {
      setConfirmDeleteOpen(false)
      setFoodIdToDelete(null)
    }
  }

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

  return (
    <div className="space-y-4" ref={tableContainerRef}>
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
                className="cursor-pointer flex items-center gap-2 font-semibold text-xs text-muted-foreground"
              >
                <span>Filter by Months</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {months.map(month => {
                const isSelected = selectedMonths.includes(month.value)
                return (
                  <DropdownMenuItem
                    key={month.value}
                    onSelect={e => {
                      e.preventDefault()
                      if (isSelected) {
                        setSelectedMonths(
                          selectedMonths.filter(m => m !== month.value)
                        )
                      } else {
                        setSelectedMonths([...selectedMonths, month.value])
                      }
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <span className="flex items-center justify-center w-4 h-4">
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-primary"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <span>{month.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectGroup>
                {categoryOptionsApi.length > 0 ? (
                  [...categoryOptionsApi]
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map(item => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="no-categories" disabled>
                    No categories found
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={nutritional} onValueChange={handleNutritionalChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Nutritional" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectGroup>
                {[...nutritionals]
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map(item => (
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
        activeRowId={activeRowId}
        setActiveRowId={setActiveRowId}
        renderRowDropdown={renderRowDropdown}
        onRowClick={handleRowClick}
      />

      {/* Add Food Popup */}
      <AddFoodPopUp
        open={openAddFoodPopUp}
        onClose={handleCloseAddFoodPopUp}
        getFoods={getFoods} // <-- pass the fetch function
      />

      {/* View Food Details Popup */}
      {foodId !== null && (
        <ViewFoodPopUp
          open={viewFood}
          onClose={handleCloseViewFoodPopUp}
          token={token ?? ""}
          foodId={foodId}
          getFoods={getFoods}
        />
      )}

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
              onClick={() => {
                setConfirmDeleteOpen(false)
              }}
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
