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
import AddRecipePopup from "./AddRecipePopUp"
import {
  createNewRecipe,
  deleteRecipeById,
  getAllRecipes,
  updateRecipe
} from "@/app/api/recipe"
import { Label } from "@/components/ui/label"
import dayjs from "dayjs"
import { NewRecipeTypes } from "@/types/recipeTypes"
import {
  deleteImageFromFirebase,
  uploadImageToFirebase
} from "@/lib/firebaseImageUtils"
import { useRecipeStore } from "@/stores/useRecipeStore"
import { toast } from "sonner"
import EditRecipePopUp from "./EditRecipePopUp"
import { useUpdateRecipeStore } from "@/stores/useUpdateRecipeStore"
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
  healthBenefits: { healthBenefit: string }[]
  preparation: string
  rest: string
  persons: number
  ingredients: { ingredientName: string }[]
}

interface TableDataTypes {
  id: number
  imageUrl: string
  recipeName: string
  category: string
  servings: number
  mainIngredient: string[]
  benefits: string[]
  createDate: string
  status: boolean
  authorImage: string
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
  const [searchText, setSearchText] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedPersons, setSelectedPersons] = useState<string>("")
  const [selectedBenefit, setSelectedBenefit] = useState<string>("")
  const [viewRecipe, setViewRecipe] = useState<boolean>(false)
  const [viewRecipeId, setViewRecipeId] = useState<number>(0)
  const [tableData, setTableData] = useState<TableDataTypes[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { resetRecipe } = useRecipeStore()
  const [previousRecipeImg, setPreviousRecipeImg] = useState<string>("")
  const [previousAuthorImg, setPreviousAuthorImg] = useState<string>("")
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)

  const handleOpenDeleteConfirm = (id: number): void => {
    setViewRecipeId(id)
    setConfirmDeleteOpen(true)
  }
  const handlecloseDeleteConfirm = (): void => {
    setConfirmDeleteOpen(false)
    setViewRecipeId(0)
  }

  // handle get users
  const getRecipes = async (): Promise<void> => {
    try {
      const response = await getAllRecipes(token)
      if (response.status === 200) {
        const tableData: TableDataTypes[] = response.data.map(
          (recipe: RecipeDataType) => ({
            id: recipe.id,
            imageUrl: recipe.images,
            recipeName: recipe.name,
            category: recipe.category,
            servings: recipe.persons,
            mainIngredient: recipe.ingredients.map(
              ingredient => ingredient.ingredientName
            ),
            benefits: recipe.healthBenefits.map(
              benefit => benefit.healthBenefit
            ),
            createDate: dayjs(recipe.createdAt).format("DD-MM-YYYY"),
            status: recipe.isActive,
            authorImage: recipe.images[0]
          })
        )
        setTableData(tableData)
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

  // handle open add Recipe popup
  const handleOpenAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(true)
  }
  // handle close add Recipe popup
  const handleCloseAddRecipePopUp = (): void => {
    setOpenAddRecipePopUp(false)
  }

  // handle open view Recipe popup
  const handleOpenViewRecipePopUp = (
    id: number,
    authorImg: string,
    recipeImg: string
  ): void => {
    setViewRecipeId(id)
    setViewRecipe(true)
    setPreviousAuthorImg(authorImg)
    setPreviousRecipeImg(recipeImg)
  }
  // handle close view Recipe popup
  const handleCloseViewRecipePopUp = (): void => {
    setViewRecipeId(0)
    setViewRecipe(false)
  }

  // handle search text change
  const handleSearchTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchText(e.target.value)
  }

  const columns: Array<Column<TableDataTypes>> = [
    {
      accessor: "imageUrl",
      header: "Media",
      cell: (row: TableDataTypes) => (
        <Image
          src={row.imageUrl[0]}
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
      cell: (row: TableDataTypes) => (
        <Badge variant={"outline"}>{row.category}</Badge>
      )
    },
    {
      accessor: "servings",
      header: "Servings",
      className: "w-28",
      cell: (row: TableDataTypes) => (
        <Label className="text-gray-500">{row.servings} Servings</Label>
      )
    },
    {
      accessor: "mainIngredient",
      header: "Main Ingredients",
      cell: (row: TableDataTypes) => (
        <div className="flex flex-wrap gap-2">
          {row.mainIngredient.map((ingredient, idx) => (
            <Badge key={`${ingredient}-${idx}`} variant={"outline"}>
              {ingredient}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessor: "benefits",
      header: "Benefits",
      cell: (row: TableDataTypes) => (
        <div className="flex flex-wrap gap-2">
          {row.benefits.map((benefit, idx) => (
            <Badge key={`${benefit}-${idx}`} variant={"outline"}>
              {benefit}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessor: "createDate",
      header: "Date Added",
      cell: (row: any) => dayjs(row.createdAt).format("DD/MM/YYYY")
    },
    {
      accessor: "status",
      header: "Status",
      className: "w-28",
      cell: (row: TableDataTypes) => (
        <Badge
          className={
            row.status
              ? "bg-[#B2FFAB] text-green-700 hover:bg-green-200 border border-green-700"
              : "bg-yellow-200 text-yellow-800 hover:bg-yellow-100 border border-yellow-700"
          }
        >
          {row.status ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      id: "actions",
      className: "w-12",
      cell: (row: TableDataTypes) => (
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
              onClick={() => handleUpdateStatusRecipe(row.id, row.status)}
            >
              {row.status ? "Inactive" : "Active"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleOpenViewRecipePopUp(row.id, row.authorImage, row.imageUrl)
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenDeleteConfirm(row.id)}>
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
    return tableData.filter(recipe => {
      const nameMatch = recipe.recipeName
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const scoreMatch =
        selectedPersons === "" || recipe.servings === Number(selectedPersons)
      const categoryMatch =
        selectedCategory === "" || recipe.category === selectedCategory
      const benefitMatch =
        selectedBenefit === "" ||
        (Array.isArray(recipe.benefits) &&
          recipe.benefits.some(benefit =>
            benefit.toLowerCase().includes(selectedBenefit.toLowerCase())
          ))

      return nameMatch && categoryMatch && scoreMatch && benefitMatch
    })
  }, [
    tableData,
    searchText,
    selectedCategory,
    selectedPersons,
    selectedBenefit
  ])

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

  // handle Score change
  const handleBenefitChange = (value: string): void => {
    setSelectedBenefit(value)
  }

  // handle clear search values
  const handleClearSearchValues = (): void => {
    setSearchText("")
    setSelectedCategory("")
    setSelectedPersons("")
    setSelectedBenefit("")
    setSelectedBenefit("")
  }

  const categories: dataListTypes[] = [
    { value: "vegetables", label: "vegetables" },
    { value: "dairy", label: "dairy" },
    { value: "Dinner", label: "Dinner" },
    { value: "Italian", label: "Italian" }
  ]

  // genarate score points
  const servings = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString()
  }))

  const healthBenefits: dataListTypes[] = [
    { value: "qqqqq", label: "qqqqq" },
    { value: "aaaaa", label: "aaaaa" },
    { value: "loading", label: "loading" }
  ]

  const uploadMoodImageAndSetUrl = async (): Promise<{
    recipeImageUrl: string | null
    authorImageUrl: string | null
  }> => {
    const { translations } = useRecipeStore.getState()
    const recipeImage = translations.en.recipeImage
    const authorImage = translations.en.authorimage

    let recipeImageUrl: string | null = null
    let authorImageUrl: string | null = null

    const uploadImage = async (
      imageFile: string | File | undefined,
      prefix: string
    ): Promise<string | null> => {
      if (!imageFile) return null

      const folder = "recipe"
      const fileName = `${prefix}-${Date.now()}`

      let fileToUpload: File | Blob

      if (typeof imageFile === "string") {
        try {
          const blob = await fetch(imageFile).then(res => res.blob())
          fileToUpload = blob
        } catch (err) {
          console.error(`Failed to convert ${prefix} string to Blob`, err)
          return null
        }
      } else {
        fileToUpload = imageFile
      }

      return await uploadImageToFirebase(fileToUpload, folder, fileName)
    }

    if (recipeImage) {
      recipeImageUrl = await uploadImage(recipeImage, "recipe-image")
    }

    if (authorImage) {
      authorImageUrl = await uploadImage(authorImage, "recipe-author-image")
    }

    return { recipeImageUrl, authorImageUrl }
  }

  // handle create new recipe
  const handleCreateNewRecipe = async () => {
    setIsLoading(true)

    const { translations, allowMultiLang } = useRecipeStore.getState()
    const { recipeImageUrl, authorImageUrl } = await uploadMoodImageAndSetUrl()

    await uploadMoodImageAndSetUrl()

    const requestBody: NewRecipeTypes = {
      name: translations.en.name,
      nameFR: translations.fr.name,
      category: translations.en.category,
      categoryFR: translations.fr.category,
      season: translations.en.season,
      seasonFR: translations.fr.season,
      isActive: true,
      allowMultiLang: allowMultiLang,
      attribute: {
        preparation: translations.en.preparation,
        preparationFR: translations.fr.preparation,
        rest: translations.en.rest,
        restFR: translations.fr.rest,
        persons: Number(translations.en.persons)
      },
      describe: {
        description: translations.en.recipe,
        descriptionFR: translations.fr.recipe
      },
      images: [
        {
          imageUrl: recipeImageUrl || ""
        }
      ],
      healthBenefits: translations.en.benefits.map((benefit, index) => ({
        healthBenefit: benefit,
        healthBenefitFR: translations.fr.benefits[index] || ""
      })),
      author: {
        authorName: translations.en.authorName,
        authorCategory: translations.en.authorCategory,
        authorCategoryFR: translations.fr.authorCategory,
        authorPhone: translations.en.phone,
        authorEmail: translations.en.email,
        authorWebsite: translations.en.website,
        authorImage: authorImageUrl || ""
      },
      ingredients: translations.en.ingredientData.map((ingredient, index) => ({
        ingredientName: ingredient.ingredientName,
        ingredientNameFR:
          translations.fr.ingredientData[index].ingredientName || "",
        quantity: translations.en.ingredientData[index].quantity || "",
        quantityFR: translations.fr.ingredientData[index].quantity || "",
        mainIngredient: true,
        foodId: translations.en.ingredientData[index].foodId,
        available: Boolean(
          translations.en.ingredientData[index].availableInIngredient
        )
      }))
    }

    try {
      const res = await createNewRecipe(token, requestBody)

      if (res.status === 200 || res.status === 201) {
        toast.success("Recipe added successfully")
        setOpenAddRecipePopUp(false)
        getRecipes()

        // clear store and session
        resetRecipe()

        sessionStorage.removeItem("recipe-storage")
      } else {
        toast.error("Failed to add recipe!")
        if (recipeImageUrl && authorImageUrl) {
          await deleteImageFromFirebase(recipeImageUrl)
          await deleteImageFromFirebase(authorImageUrl)
        }
      }
    } catch (error) {
      console.log("error creating new recipe", error)
    } finally {
      setIsLoading(false)
    }
  }

  // handle update recipe
  const handleUpdateRecipe = async () => {
    setIsLoading(true)

    const { translationsData, resetUpdatedStore } =
      useUpdateRecipeStore.getState()

    const recipeImage = translationsData.en.recipeImage
    const authorImage = translationsData.en.authorimage

    let recipeImageUrl: string | null = null
    let authorImageUrl: string | null = null

    const uploadImage = async (
      imageFile: string | File | undefined,
      prefix: string
    ): Promise<string | null> => {
      if (!imageFile) return null

      const folder = "recipe"
      const fileName = `${prefix}-${Date.now()}`

      let fileToUpload: File | Blob

      if (typeof imageFile === "string") {
        try {
          const blob = await fetch(imageFile).then(res => res.blob())
          fileToUpload = blob
        } catch (err) {
          console.error(`Failed to convert ${prefix} string to Blob`, err)
          return null
        }
      } else {
        fileToUpload = imageFile
      }

      return await uploadImageToFirebase(fileToUpload, folder, fileName)
    }

    // Upload recipe image only if it's a new file or data URL
    if (recipeImage) {
      recipeImageUrl = await uploadImage(recipeImage, "recipe-image")
    } else {
      recipeImageUrl = translationsData.en.recipeImage || null
    }

    // Upload author image only if it's a new file or data URL
    if (authorImage) {
      authorImageUrl = await uploadImage(authorImage, "recipe-author-image")
    } else {
      authorImageUrl = translationsData.en.authorimage || null
    }

    const requestBody: Partial<NewRecipeTypes> = {}

    // Root fields
    if (translationsData.en.name) requestBody.name = translationsData.en.name
    if (translationsData.fr.name) requestBody.nameFR = translationsData.fr.name

    if (translationsData.en.category)
      requestBody.category = translationsData.en.category
    if (translationsData.fr.category)
      requestBody.categoryFR = translationsData.fr.category

    if (translationsData.en.season)
      requestBody.season = translationsData.en.season
    if (translationsData.fr.season)
      requestBody.seasonFR = translationsData.fr.season

    // Images
    if (recipeImageUrl) {
      requestBody.images = [{ imageUrl: recipeImageUrl }]
    }

    // Description
    if (translationsData.en.recipe || translationsData.fr.recipe) {
      requestBody.describe = {
        description: translationsData.en.recipe ?? "",
        descriptionFR: translationsData.fr.recipe ?? ""
      }
    }

    // Attributes
    const attribute: Partial<NewRecipeTypes["attribute"]> = {}
    if (translationsData.en.preparation)
      attribute.preparation = translationsData.en.preparation
    if (translationsData.fr.preparation)
      attribute.preparationFR = translationsData.fr.preparation
    if (translationsData.en.rest) attribute.rest = translationsData.en.rest
    if (translationsData.fr.rest) attribute.restFR = translationsData.fr.rest
    if (translationsData.en.persons)
      attribute.persons = Number(translationsData.en.persons)

    if (Object.keys(attribute).length > 0) {
      requestBody.attribute = attribute
    }

    // Health Benefits
    if (
      Array.isArray(translationsData.en.benefits) &&
      translationsData.en.benefits.length > 0
    ) {
      requestBody.healthBenefits = translationsData.en.benefits.map(
        (benefit, index) => ({
          healthBenefit: benefit,
          healthBenefitFR: translationsData.fr.benefits?.[index] || ""
        })
      )
    }

    // Author
    const author: Partial<NewRecipeTypes["author"]> = {}

    if (translationsData.en.authorName) {
      author.authorName = translationsData.en.authorName
    }
    if (translationsData.en.authorCategory) {
      author.authorCategory = translationsData.en.authorCategory
    }
    if (translationsData.fr.authorCategory) {
      author.authorCategoryFR = translationsData.fr.authorCategory
    }
    if (translationsData.en.phone) {
      author.authorPhone = translationsData.en.phone
    }
    if (translationsData.en.email) {
      author.authorEmail = translationsData.en.email
    }
    if (translationsData.en.website) {
      author.authorWebsite = translationsData.en.website
    }
    if (authorImageUrl) {
      author.authorImage = authorImageUrl
    }

    // Only include author in requestBody if any property was added
    if (Object.keys(author).length > 0) {
      requestBody.author = author
    }

    // Ingredients
    if (
      Array.isArray(translationsData.en.ingredientData) &&
      translationsData.en.ingredientData.length > 0
    ) {
      requestBody.ingredients = translationsData.en.ingredientData.map(
        (ingredient, index) => ({
          ingredientName: ingredient.ingredientName,
          ingredientNameFR:
            translationsData.fr.ingredientData?.[index]?.ingredientName || "",
          quantity: ingredient.quantity || "",
          quantityFR:
            translationsData.fr.ingredientData?.[index]?.quantity || "",
          mainIngredient: true,
          foodId: ingredient.foodId,
          available: Boolean(ingredient.availableInIngredient)
        })
      )
    }

    try {
      const res = await updateRecipe(token, viewRecipeId, requestBody)

      if (res.status === 200 || res.status === 201) {
        toast.success("Recipe updated successfully")
        setViewRecipe(false)
        getRecipes()

        if (recipeImageUrl && previousRecipeImg) {
          await deleteImageFromFirebase(previousRecipeImg)
        }

        if (authorImageUrl && previousAuthorImg) {
          await deleteImageFromFirebase(previousAuthorImg)
        }

        handleCloseViewRecipePopUp()

        setPreviousAuthorImg("")
        setPreviousRecipeImg("")

        // clear store and session
        resetRecipe()
        sessionStorage.removeItem("recipe-storage")

        resetUpdatedStore()
        sessionStorage.removeItem("update-recipe-storage")
      } else {
        toast.error("Failed to update recipe!")
        if (recipeImageUrl) {
          await deleteImageFromFirebase(recipeImageUrl)
        }

        if (authorImageUrl) {
          await deleteImageFromFirebase(authorImageUrl)
        }
      }
    } catch (error) {
      console.log("Error updating recipe", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatusRecipe = async (
    recipeId: number,
    status: boolean
  ) => {
    setIsLoading(true)

    const requestBody: Partial<NewRecipeTypes> = {
      isActive: status ? false : true
    }

    try {
      const res = await updateRecipe(token, recipeId, requestBody)

      if (res.status === 200 || res.status === 201) {
        toast.success("Recipe updated successfully")
        setViewRecipe(false)
        getRecipes()

        handleCloseViewRecipePopUp()
      } else {
        toast.error("Failed to update recipe!")
      }
    } catch (error) {
      console.log("Error updating recipe", error)
    } finally {
      setIsLoading(false)
    }
  }

  // handle delete daily tip
  const handleDeleteDailyTip = async (): Promise<void> => {
    try {
      const response = await deleteRecipeById(token, viewRecipeId)
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message)
        getRecipes()
      } else {
        console.log("failed to delete recipe : ", response)
        toast.error("Failed to delete recipe!")
      }
    } catch (error) {
      console.log("failed to delete recipe : ", error)
    }
  }

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
            <SelectTrigger className="w-32">
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
        addRecipe={handleCreateNewRecipe}
        isLoading={isLoading}
      />

      {/* view recipe pupup */}
      <EditRecipePopUp
        open={viewRecipe}
        token={token}
        recipeId={viewRecipeId}
        onClose={handleCloseViewRecipePopUp}
        editRecipe={handleUpdateRecipe}
        isLoading={false}
      />

      {/* delete confirmation popup  */}
      <AlertDialog
        open={confirmDeleteOpen}
        onOpenChange={handlecloseDeleteConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recipe?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handlecloseDeleteConfirm}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDailyTip}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
