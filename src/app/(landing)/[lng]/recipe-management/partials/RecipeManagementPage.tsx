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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Check } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
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
import type { NewRecipeTypes } from "@/types/recipeTypes"
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
import { useGetAllTags } from "@/query/hooks/useGetAllTags"
import type { CategoryTypes, TagTypes } from "./AddRecipePopUpContent"
import { useGetAllRecipeCategorys } from "@/query/hooks/useGetAllRecipeCategorys"
import { useTranslation } from "@/query/hooks/useTranslation"

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
  healthBenefits: Array<{ healthBenefit: string }>
  preparation: string
  rest: string
  persons: number
  ingredients: Array<{ ingredientName: string }>
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBenefit, setSelectedBenefit] = useState<string>("")
  const [viewRecipe, setViewRecipe] = useState<boolean>(false)
  const [viewRecipeId, setViewRecipeId] = useState<number>(0)
  const [tableData, setTableData] = useState<TableDataTypes[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { resetRecipe } = useRecipeStore()
  const [previousRecipeImg, setPreviousRecipeImg] = useState<string>("")
  const [previousAuthorImg, setPreviousAuthorImg] = useState<string>("")
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false)
  const [categoryOptions, setCategoryOptions] = useState<dataListTypes[]>([])
  const [benefitsOptions, setBenefitsOptions] = useState<dataListTypes[]>([])
  const [activeRowId, setActiveRowId] = useState<number | null>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { translateText } = useTranslation()

  const { recipeCategory } = useGetAllRecipeCategorys() as {
    recipeCategory: CategoryTypes[]
  }
  const { tags: benefitsTags } = useGetAllTags(token, "Benefit") as {
    tags: TagTypes[]
  }

  useEffect(() => {
    if (recipeCategory?.length) {
      const categories: dataListTypes[] = recipeCategory.map(
        (category: CategoryTypes) => ({
          value: category.categoryName,
          label: category.categoryName
        })
      )
      setCategoryOptions(categories)
    }
  }, [recipeCategory])

  useEffect(() => {
    if (benefitsTags?.length) {
      const healthBenefits: dataListTypes[] = benefitsTags.map(
        (tag: TagTypes) => ({
          value: tag.category,
          label: tag.category
        })
      )
      setBenefitsOptions(healthBenefits)
    }
  }, [benefitsTags])

  const handleOpenDeleteConfirm = (id: number): void => {
    setViewRecipeId(id)
    setConfirmDeleteOpen(true)
  }
  const handlecloseDeleteConfirm = (): void => {
    setConfirmDeleteOpen(false)
    setViewRecipeId(0)
  }

  // handle get recipes
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

  useEffect(() => {
    if (!viewRecipe) {
      resetRecipe()
      sessionStorage.removeItem("recipe-storage")
      sessionStorage.removeItem("update-recipe-storage")
    }
  }, [viewRecipe])

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

  // Add handler for checkbox change
  const handleCategoryCheckboxChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  useEffect(() => {
    if (activeRowId === null) return
    function handleClickOutside(event: MouseEvent) {
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
    }
  ]

  // Add: handle row click to open view popup
  const handleRowClick = (row: TableDataTypes): void => {
    handleOpenViewRecipePopUp(row.id, row.authorImage, row.imageUrl)
  }

  // Render row dropdown function (like StoreManagementPage)
  const renderRowDropdown = (row: TableDataTypes): React.ReactNode => (
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
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              void handleUpdateStatusRecipe(row.id, row.status)
              setActiveRowId(null)
            }}
          >
            {row.status ? "Inactive" : "Active"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              handleOpenViewRecipePopUp(row.id, row.authorImage, row.imageUrl)
              setActiveRowId(null)
            }}
          >
            View
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={e => {
              e.stopPropagation()
              handleOpenDeleteConfirm(row.id)
              setActiveRowId(null)
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  const pageSizeOptions = [5, 10, 20]

  // filter recipes
  const filteredRecipes = useMemo(() => {
    return tableData.filter(recipe => {
      const nameMatch = recipe.recipeName
        .toLowerCase()
        .includes(searchText.toLowerCase())
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(recipe.category)
      const benefitMatch =
        selectedBenefit === "" ||
        (Array.isArray(recipe.benefits) &&
          recipe.benefits.some(benefit =>
            benefit.toLowerCase().includes(selectedBenefit.toLowerCase())
          ))

      return nameMatch && categoryMatch && benefitMatch
    })
  }, [
    tableData,
    searchText,
    selectedCategories,
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
    setSelectedCategories([value])
  }

  // handle Score change
  const handleBenefitChange = (value: string): void => {
    setSelectedBenefit(value)
  }

  // handle clear search values
  const handleClearSearchValues = (): void => {
    setSearchText("")
    setSelectedCategories([])
    setSelectedBenefit("")
  }

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
  const handleCreateNewRecipe = async (): Promise<void> => {
    setIsLoading(true)

    const { translations, allowMultiLang } = useRecipeStore.getState()
    const { recipeImageUrl, authorImageUrl } = await uploadMoodImageAndSetUrl()

    await uploadMoodImageAndSetUrl()

    const translatedIngredients = await Promise.all(
      translations.en.ingredientData.map(async (ingredient, index) => {
        const translatedName = await translateText(ingredient.ingredientName)

        return {
          ingredientName: ingredient.ingredientName,
          ingredientNameFR: translatedName,
          quantity: ingredient.quantity ?? "",
          quantityFR: translations.fr.ingredientData?.[index]?.quantity ?? "",
          mainIngredient:
            translations.fr.ingredientData?.[index]?.mainIngredient ?? false,
          foodId: ingredient.foodId,
          available: Boolean(ingredient.available)
        }
      })
    )

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
          imageUrl: recipeImageUrl ?? ""
        }
      ],
      healthBenefits: translations.en.benefits.map((benefit, index) => ({
        healthBenefit: benefit,
        healthBenefitFR: translations.fr.benefits[index] ?? ""
      })),
      author: {
        authorName: translations.en.authorName,
        authorCategory: translations.en.authorCategory,
        authorCategoryFR: translations.fr.authorCategory,
        authorPhone: translations.en.phone,
        authorEmail: translations.en.email,
        authorWebsite: translations.en.website,
        authorImage: authorImageUrl ?? ""
      },
      ingredients: translatedIngredients
    }

    try {
      const res = await createNewRecipe(token, requestBody)

      if (res.status === 200 || res.status === 201) {
        toast.success("Recipe added successfully")
        setOpenAddRecipePopUp(false)
        void getRecipes()

        // clear store and session
        resetRecipe()

        sessionStorage.removeItem("recipe-storage")
      } else {
        toast.error(res.data.message[0])
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
  const handleUpdateRecipe = async (): Promise<void> => {
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
      recipeImageUrl = translationsData.en.recipeImage ?? null
    }

    // Upload author image only if it's a new file or data URL
    if (authorImage) {
      authorImageUrl = await uploadImage(authorImage, "recipe-author-image")
    } else {
      authorImageUrl = translationsData.en.authorimage ?? null
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
          healthBenefitFR: translationsData.fr.benefits?.[index] ?? ""
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
    const translatedIngredients = await Promise.all(
      (translationsData.en.ingredientData ?? []).map(
        async (ingredient, index) => {
          let translatedName = ""
          try {
            translatedName = await translateText(ingredient.ingredientName)
          } catch (error) {
            console.error(
              "Translation error for ingredient:",
              ingredient.ingredientName,
              error
            )
          }

          return {
            ingredientName: ingredient.ingredientName,
            ingredientNameFR: translatedName,
            quantity: ingredient.quantity ?? "",
            quantityFR:
              translationsData.fr.ingredientData?.[index]?.quantity ?? "",
            mainIngredient:
              translationsData.fr.ingredientData?.[index]?.mainIngredient ??
              false,
            foodId: ingredient.foodId,
            available: ingredient.available
          }
        }
      )
    )

    requestBody.ingredients = translatedIngredients

    try {
      const res = await updateRecipe(token, viewRecipeId, requestBody)

      if (res.status === 200 || res.status === 201) {
        toast.success("Recipe updated successfully")
        setViewRecipe(false)
        void getRecipes()

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
        toast.error(res.data.message[0])
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
  ): Promise<void> => {
    setIsLoading(true)

    const requestBody: Partial<NewRecipeTypes> = {
      isActive: !status
    }

    try {
      const res = await updateRecipe(token, recipeId, requestBody)

      if (res.status === 200 || res.status === 201) {
        toast.success("Recipe updated successfully")
        setViewRecipe(false)
        void getRecipes()

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
        void getRecipes()
      } else {
        console.log("failed to delete recipe : ", response)
        toast.error("Failed to delete recipe!")
      }
    } catch (error) {
      console.log("failed to delete recipe : ", error)
    }
  }

  return (
    <div className="space-y-4" ref={tableContainerRef}>
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap w-[80%] gap-2">
          {/* search recipes by name */}
          <Input
            className="max-w-xs"
            placeholder="Search by recipe name..."
            value={searchText}
            onChange={handleSearchTextChange}
          />
          {/* multi-select category */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-32 truncate text-left overflow-x-auto overflow-y-hidden justify-between">
                {selectedCategories.length === 0 ? (
                  <span className="text-muted-foreground font-normal">Category</span>
                ) : (
                  selectedCategories.join(", ")
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-80 overflow-y-auto min-w-[8rem]">
              <DropdownMenuSeparator />
              {[...categoryOptions]
                .sort((a, b) => a.label.localeCompare(b.label))
                .map(item => {
                  const isSelected = selectedCategories.includes(item.value)
                  return (
                    <DropdownMenuItem
                      key={item.value}
                      onSelect={e => {
                        e.preventDefault();
                        if (isSelected) {
                          setSelectedCategories(selectedCategories.filter(c => c !== item.value));
                        } else {
                          setSelectedCategories([...selectedCategories, item.value]);
                        }
                      }}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <span className="flex items-center justify-center w-4 h-4">
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </span>
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* select Health Benefits */}
          <Select value={selectedBenefit} onValueChange={handleBenefitChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Health Benefits" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectGroup>
                {[...benefitsOptions]
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map(item => (
                    <SelectItem key={item.value} value={item.value.toString()}>
                      {item.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* clear filters button */}
          {(Boolean(searchText) ||
            Boolean(selectedCategories.length) ||
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
        activeRowId={activeRowId}
        setActiveRowId={setActiveRowId}
        renderRowDropdown={renderRowDropdown}
        onRowClick={handleRowClick}
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
