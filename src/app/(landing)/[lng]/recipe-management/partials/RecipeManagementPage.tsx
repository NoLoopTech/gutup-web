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
import { MoreVertical } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import AddRecipePopup from "./AddRecipePopUp"
// import { getAllRecipes, deleteRecipeById } from "@/app/api/recipe"
import { useDeleteRecipe } from "@/query/hooks/useDeleteRecipes"
import { Label } from "@/components/ui/label"
import dayjs from "dayjs"
import ViewRecipePopUp from "./ViewRecipePopUp"
import { useGetAllRecipes } from "@/query/hooks/useGetAllRecipes"
import { getAllTagsByCategory } from "@/app/api/tags"
import { toast } from "sonner"
// import EditRecipePopUp from "./EditRecipePopUp"
interface Column<T> {
  accessor?: keyof T | ((row: T) => React.ReactNode)
  header?: string
  id?: string
  cell?: (row: T) => React.ReactNode
  className?: string
}

interface HealthBenefitItem {
  healthBenefit: string
  healthBenefitFR: string
}

interface RecipeDataType {
  id: number
  name: string
  category: string
  createdAt: string
  isActive: boolean
  images: string[]
  // healthBenefits: string[]
  healthBenefits: HealthBenefitItem[]
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
  const [recipes, setRecipes] = useState<RecipeDataType[]>([])
  const [searchText, setSearchText] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedPersons, setSelectedPersons] = useState<string>("")
  const [selectedBenefit, setSelectedBenefit] = useState<string>("")
  const [viewRecipe, setViewRecipe] = useState<boolean>(false)
  const [viewRecipeId, setViewRecipeId] = useState<number>(0)
  // const [openEditRecipePopUp, setOpenEditRecipePopUp] = useState<boolean>(false)
  // const [editRecipeData, setEditRecipeData] = useState<RecipeDataType | null>(
  //   null
  // )
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const { deleteRecipe } = useDeleteRecipe(token)
  const [recipeId, setRecipeId] = useState<number>(0)

  const { clients } = useGetAllRecipes<RecipeDataType>(token)
  const [healthBenefitTypes, setHealthBenefitTypes] = useState<dataListTypes[]>(
    []
  )

  // handle get users
  // const getRecipes = async (): Promise<void> => {
  //   try {
  //     const response = await getAllRecipes(token)
  //     if (response.status === 200) {
  //       seRecipes(response.data)
  //     } else {
  //       console.log(response)
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch users:", error)
  //   }
  // }

  // useEffect(() => {
  //   void getRecipes()
  // }, [])

  // const handleOpenEditRecipePopUp = (recipe: RecipeDataType): void => {
  //   console.log("byeeee")
  //   setEditRecipeData(recipe) // Set the recipe data to be edited
  //   setOpenEditRecipePopUp(true) // Open the popup
  // }

  // const handleOpenEditRecipePopUp = (id: number): void => {
  //   setViewRecipeId(id)
  //   setViewRecipe(false)
  //   setOpenEditRecipePopUp(true)
  // }

  // handle delete recipe OverView
  const handleDeleteRecipe = (recipeId: number): void => {
    setRecipeId(recipeId)
    setConfirmDeleteOpen(true)
  }

  // handle delete recipe by id
  const handleDeleteRecipeById = async (): Promise<void> => {
    if (!recipeId) {
      toast.error("Recipe ID is invalid.")
      return
    }
    const result = await deleteRecipe(recipeId)
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

  // handle close delete confirmation popup
  const handleCloseDeleteConfirmationPopup = (): void => {
    setConfirmDeleteOpen(false)
  }

  // handle open add Recipe popup
  const handleOpenAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(true)
  }
  // handle close add Recipe popup
  const handleCloseAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(false)
  }

  // handle open view Recipe popup
  const handleOpenViewRecipePopUp = (id: number): void => {
    setViewRecipeId(id)
    setViewRecipe(true)
  }
  // handle close view Recipe popup
  const handleCloseViewRecipePopUp = (): void => {
    setViewRecipe(false)
  }

  // handle search text change
  const handleSearchTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchText(e.target.value)
  }

  useEffect(() => {
    if (clients) {
      setRecipes(clients)
      console.log("clients : ", clients)
    }
  }, [clients])

  interface TagType {
    tagId: number
    category: string
    count: number
    status: boolean
  }

  useEffect(() => {
    const fetchHealthTags = async (): Promise<void> => {
      try {
        const res = await getAllTagsByCategory(token, "Benefit")
        const tags = res?.data

        if (Array.isArray(tags)) {
          console.log("tags2", tags)
          setHealthBenefitTypes(
            tags.map((tag: TagType) => ({
              value: tag.category,
              label: tag.category
            }))
          )
          console.log("healthBenefitTypes", healthBenefitTypes)
        }
      } catch (error) {
        console.error("Error fetching health benefit tags:", error)
      }
    }

    void fetchHealthTags()
  }, [token])

  const columns: Column<RecipeDataType>[] = [
    {
      accessor: "images",
      header: "Media",
      cell: (row: RecipeDataType) => (
        <Image
          src={row.images[0]}
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
      cell: (row: RecipeDataType) => (
        <Label className="text-gray-500">{row.persons} Servings</Label>
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
            <DropdownMenuItem
              onClick={() => {
                handleOpenViewRecipePopUp(row.id)
              }}
            >
              View
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() => {
                handleOpenEditRecipePopUp(row.id)
              }}
            >
              Edit
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => {
                handleDeleteRecipe(row.id)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  const pageSizeOptions = [5, 10, 20]

  // filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const nameMatch = recipe.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const scoreMatch =
        selectedPersons === "" || recipe.persons === Number(selectedPersons)
      const categoryMatch =
        selectedCategory === "" || recipe.category === selectedCategory
      const benefitMatch =
        selectedBenefit === "" ||
        recipe.healthBenefits.some(
          (b: { healthBenefit: string }) => b.healthBenefit === selectedBenefit
        )
      console.log(
        "Matched:",
        recipe.healthBenefits.some(
          item => item.healthBenefit === selectedBenefit
        )
      )

      return nameMatch && categoryMatch && scoreMatch && benefitMatch
    })
  }, [recipes, searchText, selectedCategory, selectedPersons, selectedBenefit])

  const totalItems = filteredRecipes.length

  // paginate data (for table)
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredRecipes.slice(startIndex, endIndex)
  }, [filteredRecipes, page, pageSize])

  // handle page change
  const handlePageChange = (newPage: number): void => {
    setPage(newPage)
  }
  // handle page size change
  const handlePageSizeChange = (newSize: number): void => {
    setPageSize(newSize)
    setPage(1)
  }

  // handle Category change
  const handleCategoryChange = (value: string): void => {
    setSelectedCategory(value)
  }

  // handle Score change
  const handleScoreChange = (value: string): void => {
    setSelectedPersons(value)
  }

  // handle Benefit change
  const handleBenefitChange = (value: string): void => {
    setSelectedBenefit(value)
    console.log("selectedBenefit", value)
  }

  // handle clear search values
  const handleClearSearchValues = (): void => {
    setSearchText("")
    setSelectedCategory("")
    setSelectedPersons("")
    setSelectedBenefit("")
  }

  const categories: dataListTypes[] = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "snack", label: "Snack" },
    { value: "dinner", label: "Dinner" },
    { value: "drink", label: "Drink" },
    { value: "sauce", label: "Sauce" },
    { value: "condiments", label: "Condiments" },
    { value: "aperitive", label: "Aperitive" }
  ]

  // genarate score points
  const servings = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString()
  }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap w-[80%] gap-2">
          {/* search recipes by name */}
          <Input
            className="max-w-xs"
            placeholder="Search by user name..."
            value={searchText}
            onChange={handleSearchTextChange}
          />
          {/* select category */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
          <Select value={selectedPersons} onValueChange={handleScoreChange}>
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
          <Select value={selectedBenefit} onValueChange={handleBenefitChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Health Benefits" />
            </SelectTrigger>
            <SelectContent className="max-h-40">
              <SelectGroup>
                {healthBenefitTypes.map(item => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* clear filters button */}
          {(Boolean(searchText) ||
            Boolean(selectedPersons) ||
            Boolean(selectedCategory) ||
            Boolean(selectedBenefit)) && (
            <Button variant="outline" onClick={handleClearSearchValues}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* add new Recipe button */}
        <Button onClick={handleOpenAddRecipePopUp}>Add New</Button>
      </div>

      {/* Recipes management table */}
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

      {/* add Recipe popup */}
      <AddRecipePopup
        open={openAddRecipePopUp}
        onClose={handleCloseAddRecipePopUp}
        token={token}
      />

      {/* <EditRecipePopUp
        open={openEditRecipePopUp}
        onClose={() => setOpenEditRecipePopUp(false)}
        // recipeData={editRecipeData}
        recipeId={viewRecipeId}
        token={token}
      /> */}

      {/* delete confirmation popup  */}
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={handleCloseDeleteConfirmationPopup}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteConfirmationPopup}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRecipeById}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* view recipe pupup */}
      <ViewRecipePopUp
        open={viewRecipe}
        token={token}
        recipeId={viewRecipeId}
        onClose={handleCloseViewRecipePopUp}
      />
    </div>
  )
}
function fetchTags(): never {
  throw new Error("Function not implemented.")
}
