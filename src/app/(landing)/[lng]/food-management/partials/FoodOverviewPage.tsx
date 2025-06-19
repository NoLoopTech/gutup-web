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

interface FoodOverviewDataType {
  id: number
  name: string
  category: string
  healthBenefits: string[]
  season: string
  image: string
  status: string
  createdAt: string
}

export default function FoodOverviewPage({ token }: { token: string }) {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [openAddFoodPopUp, setOpenAddFoodPopUp] = useState<boolean>(false)
  const [foods, setFoods] = useState<FoodOverviewDataType[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [nutritional, setNutritional] = useState<string>("")
  const [season, setSeason] = useState<string>("")
  const [viewFood, setViewFood] = useState<boolean>(false)
  const [foodId, setFoodId] = useState<number>(0)

  // handle get users
  const getFoods = async () => {
    try {
      const response = await getAllFoods(token)
      if (response.status === 200) {
        setFoods(response.data.foods)
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  useEffect(() => {
    getFoods()
  }, [])

  // handle open add food popup
  const handleOpenAddFoodPopUp = () => {
    setOpenAddFoodPopUp(true)
  }

  // handle close add food popup
  const handleCloseAddFoodPopUp = () => {
    setOpenAddFoodPopUp(false)
  }
  // handle close view food popup
  const handleCloseViewFoodPopUp = () => {
    setViewFood(false)
  }

  // handle view user overview
  const handleViewFoodOverview = (foodId: number) => {
    setViewFood(true)
    setFoodId(foodId)
    console.log("foodId", foodId)
  }

  const columns: Column<FoodOverviewDataType>[] = [
    {
      accessor: "image",
      header: "Media",
      cell: (row: FoodOverviewDataType) => (
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
      cell: (row: FoodOverviewDataType) => (
        <Badge variant={"outline"}>{row.category}</Badge>
      )
    },
    {
      accessor: "healthBenefits",
      header: "Health Benefits",
      cell: (row: FoodOverviewDataType) => (
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
      cell: (row: FoodOverviewDataType) => (
        <Badge variant={"outline"}>{row.season}</Badge>
      )
    },
    {
      accessor: "category",
      header: "Recipes"
    },
    {
      accessor: "createdAt",
      header: "Date Added",
      cell: (row: any) => dayjs(row.createdAt).format("DD/MM/YYYY")
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: (row: FoodOverviewDataType) => (
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
      cell: (row: FoodOverviewDataType) => (
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

  const pageSizeOptions: number[] = [5, 10, 20]

  // handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  // handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  // handle search text change
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }
  // handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value)
  }
  // handle category change
  const handleNutritionalChange = (value: string) => {
    setNutritional(value)
  }
  // handle category change
  const handleSeasonChange = (value: string) => {
    setSeason(value)
  }

  // handle clear search values
  const handleClearSearchValues = () => {
    setSearchText("")
    setCategory("")
    setNutritional("")
    setSeason("")
  }

  const categories: dataListTypes[] = [
    { value: "Fruit", label: "Fruit" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Meat", label: "Meat" },
    { value: "Dairy", label: "Dairy" }
  ]

  const nutritionals: dataListTypes[] = [
    { value: "Low Calories", label: "Low Calories" },
    { value: "High Calories", label: "High Calories" },
    { value: "Low Fat", label: "Low Fat" },
    { value: "High Fat", label: "High Fat" }
  ]

  const seasons: dataListTypes[] = [
    { value: "Available year-round", label: "Available year-round" },
    { value: "Fall", label: "Fall" },
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
    { value: "Autumn", label: "Autumn" },
    { value: "Winter", label: "Winter" }
  ]

  // filter foods (for table)
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const nameMatch = food.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const categoryMatch = category === "" || food.category === category
      const nutritionalMatch = nutritional === "" || food.name === nutritional
      const seasonMatch = season === "" || food.season === season

      return nameMatch && categoryMatch && nutritionalMatch && seasonMatch
    })
  }, [foods, searchText, category, nutritional, season])

  const totalItems = filteredFoods.length

  // paginate data (for table)
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredFoods.slice(startIndex, endIndex)
  }, [filteredFoods, page, pageSize])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap w-[80%] gap-2">
          {/* search foods by name */}
          <Input
            className="max-w-xs"
            placeholder="Search by user name..."
            value={searchText}
            onChange={handleSearchTextChange}
          />
          {/* select category */}
          <Select value={category} onValueChange={handleCategoryChange}>
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

          {/* select Nutritional */}
          <Select value={nutritional} onValueChange={handleNutritionalChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Nutritional" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {nutritionals.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* select Season */}
          <Select value={season} onValueChange={handleSeasonChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {seasons.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* clear filters button */}
          {(Boolean(searchText) ||
            Boolean(category) ||
            Boolean(nutritional) ||
            Boolean(season)) && (
            <Button variant="outline" onClick={handleClearSearchValues}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* add new food button */}
        <Button onClick={handleOpenAddFoodPopUp}>Add New</Button>
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
      <AddFoodPopUp open={openAddFoodPopUp} onClose={handleCloseAddFoodPopUp} />

      <ViewFoodPopUp open={viewFood} onClose={handleCloseViewFoodPopUp} />
    </div>
  )
}
