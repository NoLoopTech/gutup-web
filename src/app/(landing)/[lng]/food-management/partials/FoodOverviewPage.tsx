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

  // handle search text change
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value)
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
          {row.healthBenefits.map(benefit => (
            <Badge variant={"outline"}>{benefit}</Badge>
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
      header: "Date Added"
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
            <DropdownMenuItem>View</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const pageSizeOptions: number[] = [5, 10, 20]

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  const categories: dataListTypes[] = [
    { value: "Fruit", label: "Fruit" },
    { value: "Vegetables", label: "Vegetables" },
    { value: "Meat", label: "Meat" },
    { value: "Dairy", label: "Dairy" }
  ]

  const nutritional: dataListTypes[] = [
    { value: "Low Calories", label: "Low Calories" },
    { value: "High Calories", label: "High Calories" },
    { value: "Low Fat", label: "Low Fat" },
    { value: "High Fat", label: "High Fat" }
  ]

  const seasons: dataListTypes[] = [
    { value: "Spring", label: "Spring" },
    { value: "Summer", label: "Summer" },
    { value: "Autumn", label: "Autumn" },
    { value: "Winter", label: "Winter" }
  ]

  const [Category, setCategory] = useState<string>("")

  // filter foods (for table)
  const filteredFoods = useMemo(() => {
    return foods.filter(food => {
      const nameMatch = food.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const categoryMatch = Category === "" || food.category === Category

      return nameMatch && categoryMatch
    })
  }, [foods, searchText, Category])

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
          <Select value={Category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {categories.map(item => (
                  <SelectItem value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* select Nutritional */}
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Nutritional" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {nutritional.map(item => (
                  <SelectItem value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* select Season */}
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {seasons.map(item => (
                  <SelectItem value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* clear filters button */}
          {(Boolean(searchText) || Boolean(Category)) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchText("")
                setCategory("")
              }}
            >
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
    </div>
  )
}
